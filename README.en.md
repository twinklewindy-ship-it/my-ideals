# My Ideals - Track your Namashashin collections

[English](./README.en.md) | [日本語](./README.ja.md) | [中文](./README.zh.md)

My Ideals is a web app for managing your idol photo (生写真 / Namashashin) collection.

- ✅ Check off photos you own
- 📊 View your collection progress at a glance
- 🔍 Quick search and filtering
- 💾 Data stored in your browser - no account required

## Quick Start

### ⚠️ Warning

All data is stored locally in your browser only. Clearing browser data, using incognito mode, or switching devices will result in permanent data loss. Please export backups regularly. **The developer is not responsible for any losses caused by data loss and cannot help recover lost data.**

https://my-ideals.notequal.me/

### Create a Profile

1. From the menu below, select **“New Profile”**.
   - **On PC**: click the dropdown list in the top-right corner
   - **On mobile**: tap the three-line (hamburger) menu in the top-right corner
2. Paste the template URL (obtained from the community or the template creator)
3. Enter a profile name
4. Click **“Create”**

### Filter by Member

- Click the member filter button to show only specific members
- Useful when templates include multiple members

### Track Your Collection

1. Browse through the collections
2. Click any item to mark it as **owned** ✓
3. Click again to unmark
4. Progress is saved automatically

### Backup Your Data

- Click **"Export"** in the top-right corner to download your data file
- Keep it safe - you can import it later if needed

## How It Works

**Template** = A photo list created by the community

A template defines what photos exist in a set (e.g., "2024 Summer Concert Goods"). Template creators maintain these lists so you don't have to manually enter each item. Just paste a template URL to get started.

**Profile** = Your personal collection tracker

A profile uses a template and records which items you own. You can have multiple profiles (e.g., one for each group, one for trading, etc.).

```
Template (shared)       Profile (yours)
┌─────────┐            ┌─────────┐
│ A       │            │ A    ✓  │  ← owned
│ B       │    -->     │ B       │
│ C       │            │ C    ✓  │  ← owned
│ ...     │            │ ...     │
└─────────┘            └─────────┘
```

## FAQ

**Q: Where is my data stored?**

A: All data is stored locally in your browser's localStorage. Nothing is sent to any server.

**Q: What if I clear my browser data?**

A: Your collection data will be lost. Always export a backup before clearing browser data.

**Q: Can I use this on multiple devices?**

A: Yes, but data doesn't sync automatically. Export from one device and import on another.

**Q: What is a template?**

A: A template is a JSON file that defines the photo list. Template creators maintain these lists so users don't have to enter each item manually.

**Q: The template URL doesn't work. What do I do?**

A: Click **"Edit Template URL"** to update the link. If the template has moved, get the new URL from the template creator.

## Links

- [Report Issues](https://github.com/monaka-ikonoi/my-ideals/issues)
