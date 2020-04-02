<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 02/04/20
 * Time: 15:40
 */

namespace App\DataTraitement\SerpData;


class DataSerp
{
    /**
     * @param array $data
     * @param string|null $index
     * @param int|null $offset
     * @return array
     */
    public static function sliceData(array $data, ?string $index = null, ?int $offset = null): array
    {
        if (is_null($index)) {
            return (new DataSerp())->arrayToSlice($data, $offset);
        }
        if (!is_null($offset)) {
            $items = isset($data[$index]) ? $data[$index] : [];

            return (new DataSerp())->arrayToSlice($items, $offset);
        }

        return isset($data[$index]) ? $data[$index] : [];
    }

    /**
     * @param array $items
     * @param string|null $offset
     * @return array
     */
    private function arrayToSlice(array $items = [], ?string $offset = null)
    {
        if ($items && count($items) >= $offset) {
            $newItems = array_slice($items, count($items) - $offset, count($items));
        } else {
            $newItems = $items;
        }
        return $newItems;
    }
}
