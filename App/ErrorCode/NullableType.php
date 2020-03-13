<?php
namespace App\ErrorCode;

use App\ErrorCode\Exception\NullableException;

class NullableType
{
    /**
     * @param $value
     * @return null
     * @throws NullableException
     */
    public static function nullOrNotString($value)
    {
        if (is_null($value) || !is_string($value)) {
            self::nullableArgument();
        }
        return null;
    }

    /**
     * @throws NullableException
     */
    public static function nullableArgument()
    {
        throw new NullableException('The value enjoyed must be an string or not nullable !!!');
    }
}
