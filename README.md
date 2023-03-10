# ⚠️⚠️⚠️已废弃⚠️⚠️⚠️
*此仓库包含的功能不再维护并已在新版本的 webui 中失效   
如果你在找双语翻译功能，推荐更换到 [sd-webui-bilingual-localization](https://github.com/journey-ad/sd-webui-bilingual-localization/blob/main/README_ZH.md) 扩展   
如果想寻找出图参数配置，[civitai.com](https://civitai.com/) 是一个很好的选择   
自定义样式可以通过调整`user.css`实现*

-----

# sd-webui-custom
给[Stable Diffusion web UI](https://github.com/AUTOMATIC1111/stable-diffusion-webui)加点料

## 功能
- 隐藏了一些功能和设置入口
- 预置了一些参数合集，方便快速起步
- 添加中文翻译(同步自webui仓库)

![](./screenshot_1.jpg)

## 安装
需要使用最新版本的webui

把`ui_custom`目录放到webui根目录   
`user.css`丢到根目录   
`custom_ui.js`丢到`javascript`目录   
重启程序，webui会自动加载

## 其他
`misc/ai_generate_webui.py`   
一个基于nonebot2框架的AI绘图机器人，支持配置prompt黑名单和调用cd

## Credits
[StableDiffusion Show](https://t.me/StableDiffusion_Show)   
