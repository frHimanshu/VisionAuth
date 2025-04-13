<?php

namespace WelcomePlugin;

use pocketmine\plugin\PluginBase;
use pocketmine\event\Listener;
use pocketmine\event\player\PlayerJoinEvent;

class Main extends PluginBase implements Listener {

    public function onEnable(): void {
        $this->getLogger()->info("WelcomePlugin enabled!");
        $this->getServer()->getPluginManager()->registerEvents($this, $this);
    }

    public function onJoin(PlayerJoinEvent $event): void {
        $player = $event->getPlayer();
        $player->sendMessage("§aWelcome to the server, §e" . $player->getName() . "§a!");
    }
}

