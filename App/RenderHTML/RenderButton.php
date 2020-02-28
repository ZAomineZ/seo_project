<?php
namespace App\RenderHTML;

class RenderButton
{
    /**
     * @param string $name
     * @param string $path
     * @return string
     */
    public function buttonWithPathSvg(string $name = '', string $path = ''): string
    {
        return "<button type=\"button\" class=\"inbox__list-button\" style='width: 9rem'>
                     <div class=\"inbox__mailbox active d-block\"'>
                          <svg class=\"mdi-icon mdi-icon-position \" fill=\"currentColor\" viewBox=\"0 0 24 24\">
                                   <path fill=\"currentColor\" d=\"{$path}\"></path>
                          </svg>
                          <p class=\"inbox__mailbox-title\" style='margin: 4px'>{$name}</p>
                     </div>
              </button>";
    }
}
