<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 03/04/19
 * Time: 02:13
 */

namespace App\Controller;


use App\Model\Crawl;
use Elboletaire\Crawler\Crawler;
use Goutte\Client;

class CrawlController
{
    private $goutte;
    private $crawl;

    public function __construct(Client $goutte, Crawl $crawl)
    {
        $this->goutte = $goutte;
        $this->crawl = $crawl;
    }

    protected function CrawlDup (array $item, string $key)
    {
        return $this->crawl->DupArrValues($item, $key);
    }


    public function ResultCrawl (string $url)
    {
        $urls = trim((string)$url);
        $data = [];
        try {
            $crawler = new Crawler($urls, 10, true);
        } catch (\Exception $e) {
            die($e->getMessage());
        }
        $list_url = $crawler->crawl();
        foreach ($list_url as $url) {
            $DomCrawler = $this->goutte->request("GET", $url['url']);
            $response = $this->goutte->getResponse();
            if (strstr(current($response->getHeaders()['Content-Type']), 'text/html')) {
                $location = $this->goutte->getRequest()->getUri();
                $statut_code = $response->getStatus();
                $content_type = current($response->getHeaders()['Content-Type']);
                $title = $DomCrawler->filter('title')->each(function ($node) {
                   return $node->text();
                });
                $h1 = $DomCrawler->filter('h1')->each(function ($node) {
                   return $node->text();
                });
                $page_word = str_word_count($DomCrawler->html());
                $content = str_word_count(implode($DomCrawler->filter('div')->each(function ($node){
                    return $node->text();
                })));
                $ratio = $page_word === 0 || $content === 0 ? 0 : round($content / $page_word);
                $meta_description = $DomCrawler->filterXPath("//meta[@name='description']")->extract(array('content'));
                $robots = $DomCrawler->filterXPath("//meta[@name='robots']")->extract(array('content'));
                $canonical = $DomCrawler->filterXpath("//link[@rel='canonical']")->extract(array('href'));
                $links = $DomCrawler->filterXPath("//a")->extract(array('href'));
                $data[] = [
                  'uri' => $url['url'],
                  'location' => $location,
                  'status' => $statut_code,
                  'content_type' => $content_type,
                  'title' => $title,
                  'h1' => $h1,
                  'text' => $content,
                  'ratio' => $ratio,
                  'meta_description' => $meta_description,
                  'robots' => empty($robots) ? 0 : $robots,
                  'canonical' => $canonical,
                  'links' => $links,
                ];
            }
        }
        $title_dup = $this->CrawlDup($data, 'title');
        $meta_dup = $this->CrawlDup($data, 'meta_description');
        $h1_dup = $this->CrawlDup($data, 'h1');
        echo \GuzzleHttp\json_encode(['dup_title' => $title_dup, 'dup_meta' => $meta_dup, 'dup_h1' => $h1_dup, 'data' => $data]);
    }
}
