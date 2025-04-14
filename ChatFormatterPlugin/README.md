# ChatFormatterPlugin

🎨 A customizable and powerful **chat formatting plugin** for [PocketMine-MP](https://pmmp.io/) servers. This plugin lets you enhance your server's chat experience with color codes, permission-based formats, and placeholders.

## 🚀 Features

- ✅ Fully customizable chat formats via `config.yml`
- 🎭 Permission-based formatting (e.g., VIP, default)
- 🎨 Supports Minecraft color codes (`&a`, `&b`, etc.)
- 🌍 Includes world name and player name placeholders
- 🛠 Easily extendable for advanced features like ranks, ping, etc.

## 📁 Directory Structure

ChatFormatterPlugin/ ├── plugin.yml ├── resources/ │ └── config.yml └── src/ └── ChatFormatter/ ├── Main.php ├── EventListener.php └── Utils.php

csharp
Copy
Edit

## 📦 Installation

1. Download or clone this repository.
2. Place the `ChatFormatterPlugin/` folder into your PocketMine-MP `plugins/` directory.
3. Start the server. The plugin will automatically create the configuration file on first run.

## ⚙️ Configuration

Open `resources/config.yml` to customize your chat formats:

```yaml
formats:
  default: "&7[{world}] &a{player}: &f{message}"
  vip: "&6[VIP] &e{player}&7: &f{message}"
Available Placeholders:
{player} - Player's name

{message} - Chat message

{world} - Current world name

Example Output:
csharp
Copy
Edit
[world] Alex: Hello everyone!
[VIP] Himanshu: Welcome to the server!
🔐 Permissions
Permission	Description	Default
chat.format.default	Applies the default chat format	✅ true
chat.format.vip	Applies the VIP chat format (example)	🔐 OP
📜 License
This project is licensed under the MIT License. Feel free to fork and modify!

🧠 Future Ideas (Optional)
PlaceholderAPI integration

GUI-based config editor

Dynamic prefixes (rank, level, ping, etc.)

Chat logger for moderation

🤝 Contributing
Fork the repo

Create your feature branch (git checkout -b feature/new-feature)

Commit your changes (git commit -am 'Add new feature')

Push to the branch (git push origin feature/new-feature)

Open a pull request 🚀
