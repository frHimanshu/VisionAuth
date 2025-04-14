<?php

namespace ChatFormatter;

use pocketmine\plugin\PluginBase;
use pocketmine\event\Listener;

class Main extends PluginBase {

    public function onEnable(): void {
        $this->saveResource("config.yml");
        $this->getServer()->getPluginManager()->registerEvents(new EventListener($this), $this);
        $this->getLogger()->info("§aChatFormatter enabled!");
    }

    public function getChatFormat(string $permission): string {
        $config = $this->getConfig()->get("formats", []);
        return $config[$permission] ?? $config["default"];
    }
}
