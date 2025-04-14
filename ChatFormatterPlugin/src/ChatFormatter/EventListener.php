<?php

namespace ChatFormatter;

use pocketmine\event\Listener;
use pocketmine\event\player\PlayerChatEvent;
use pocketmine\player\Player;

class EventListener implements Listener {

    private Main $plugin;

    public function __construct(Main $plugin) {
        $this->plugin = $plugin;
    }

    public function onChat(PlayerChatEvent $event): void {
        $player = $event->getPlayer();
        $message = $event->getMessage();

        $format = $this->plugin->getChatFormat($player->hasPermission("chat.format.vip") ? "vip" : "default");

        $formatted = str_replace(
            ["{player}", "{message}", "{world}"],
            [$player->getName(), $message, $player->getWorld()->getFolderName()],
            $format
        );

        $event->setFormat(Utils::colorize($formatted));
    }
}
