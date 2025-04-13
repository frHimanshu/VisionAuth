<?php

namespace WelcomePlugin;

use pocketmine\plugin\PluginBase;
use pocketmine\command\Command;
use pocketmine\command\CommandSender;
use pocketmine\player\Player;
use pocketmine\event\Listener;
use pocketmine\event\player\PlayerJoinEvent;

class Main extends PluginBase implements Listener {

    public function onEnable(): void {
        $this->getLogger()->info("§a[WelcomePlugin] Plugin has been enabled!");
        $this->getServer()->getPluginManager()->registerEvents($this, $this);
    }

    public function onDisable(): void {
        $this->getLogger()->info("§c[WelcomePlugin] Plugin has been disabled!");
    }

    public function onCommand(CommandSender $sender, Command $command, string $label, array $args): bool {
        if (strtolower($command->getName()) === "welcome") {
            if ($sender instanceof Player) {
                $sender->sendMessage("§bWelcome to the server, §a" . $sender->getName() . "§b!");
            } else {
                $sender->sendMessage("§eThis command can only be used by players.");
            }
            return true;
        }
        return false;
    }

    public function onJoin(PlayerJoinEvent $event): void {
        $player = $event->getPlayer();
        $player->sendMessage("§6Welcome, §e" . $player->getName() . "§6! Enjoy your stay! ✨");
    }
}
