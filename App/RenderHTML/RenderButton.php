<?php

namespace App\RenderHTML;

class RenderButton
{
    /**
     * @param string $name
     * @param string $path
     * @param bool $rankButton
     * @return string
     */
    public function buttonWithPathSvg(string $name = '', string $path = '', bool $rankButton = false): string
    {
        if ($rankButton) {
            return $this->buttonWithoutName($path);
        }

        return "<button type=\"button\" class=\"inbox__list-button\" style='width: 9rem'>
                     <div class=\"inbox__mailbox active d-block\"'>
                          <svg class=\"mdi-icon mdi-icon-position \" fill=\"currentColor\" viewBox=\"0 0 24 24\">
                                   <path fill=\"currentColor\" d=\"{$path}\"></path>
                          </svg>
                          <p class=\"inbox__mailbox-title\" style='margin: 4px'>{$name}</p>
                     </div>
              </button>";
    }

    /**
     * @param string $path
     * @return string
     */
    private function buttonWithoutName(string $path = '')
    {
        return "<div class=\"feature-list inbox__list-button\"'>
                          <svg class=\"mdi-icon mdi-icon-position \" fill=\"currentColor\" viewBox=\"0 0 24 24\">
                                   <path fill=\"currentColor\" d=\"{$path}\"></path>
                          </svg>
                     </div>";
    }
}
