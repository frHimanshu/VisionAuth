<?php

namespace ChatFormatter;

class Utils {
    public static function colorize(string $message): string {
        return preg_replace_callback('/&([0-9a-fk-or])/i', function ($matches) {
            return "§" . $matches[1];
        }, $message);
    }
}
