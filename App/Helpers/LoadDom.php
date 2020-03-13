<?php
namespace App\Helpers;

class LoadDom
{
    /**
     * @var \DOMDocument
     */
    private $document;

    /**
     * LoadDom constructor.
     * @param \DOMDocument $document
     */
    public function __construct(\DOMDocument $document)
    {
        $this->document = $document;
    }

    /**
     * @param $resultHtml
     * @return mixed
     */
    public function LoadHtmlDom($resultHtml)
    {
        if (!empty($resultHtml)) {
            $this->InternalError(true);
            $this->document->loadHTML($resultHtml);
            return $this->document;
        }
    }

    /**
     * @param bool $bool
     * @return bool
     */
    private function InternalError(bool $bool = true)
    {
        return libxml_use_internal_errors($bool);
    }
}
