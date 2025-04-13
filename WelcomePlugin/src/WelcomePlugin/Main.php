<?php

namespace WelcomePlugin;

use pocketmine\plugin\PluginBase;
use pocketmine\command\CommandSender;
use pocketmine\command\Command;
use pocketmine\player\Player;

class Main extends PluginBase {

    public function onEnable(): void {
        $this->getLogger()->info("§a[WelcomePlugin] Plugin has been enabled!");
    }

    public function onDisable(): void {
        $this->getLogger()->info("§c[WelcomePlugin] Plugin has been disabled!");
    }

    public function onCommand(CommandSender $sender, Command $command, string $label, array $args): bool {
        if (strtolower($command->getName()) === "welcome") {
            if ($sender instanceof Player) {
                $sender->sendMessage("§bWelcome to the server, " . $sender->getName() . "!");
            } else {
                $sender->sendMessage("§eThis command can only be run by a player.");
            }
            return true;
        }
        return false;
    }
}
