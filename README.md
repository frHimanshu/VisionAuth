## Minecrafters
A collection of practical PocketMine-MP plugins to enhance your Minecraft Bedrock server experience.

## Installation

### **For Linux/MacOS**

1. **Install PocketMine-MP**:
   - Install required dependencies:
     ```bash
     sudo apt-get update
     sudo apt-get install php php-cli php-mbstring php-xml php-curl git unzip
     ```

   - Clone PocketMine-MP:
     ```bash
     git clone https://github.com/pmmp/PocketMine-MP.git
     cd PocketMine-MP
     ```

   - Run the installation script:
     ```bash
     ./start.sh
     ```

2. **Install the Plugin**:
   - Clone the plugin into the `plugins/` directory:
     ```bash
     cd ~/minecraft-server/plugins
     git clone https://github.com/frHimanshu/minecrafters.git
     ```

   - Restart the server:
     ```bash
     cd ~/minecraft-server
     ./start.sh
     ```

---

### **For Windows**

1. **Install PocketMine-MP**:
   - Download the latest version of PocketMine-MP from [here](https://github.com/pmmp/PocketMine-MP/releases).
   - Extract it to a folder, and run `start.cmd`.

2. **Install the Plugin**:
   - Clone the plugin into the `plugins/` directory:
     ```bash
     git clone https://github.com/frHimanshu/minecrafters.git
     ```

   - Restart the server by running `start.cmd` again.

---

## Configuration

To modify the welcome message, edit the message in the `Main.php` file:

```php
$this->getServer()->getLogger()->info("Welcome to the server, {$player->getName()}!");
