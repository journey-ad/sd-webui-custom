# -*- coding: UTF-8 -*-
import asyncio
import base64
import random
import time
import json
import re
from typing import DefaultDict, List, Optional, Tuple
import nonebot
from nonebot import on_command
from nonebot.rule import to_me
from nonebot.adapters.onebot.v11 import (
  Bot,
  Event,
  MessageSegment,
  Message,
  MessageEvent,
  GroupMessageEvent,
  PrivateMessageEvent,
)
from nonebot.matcher import Matcher
from nonebot.params import ArgPlainText, CommandArg
from nonebot.params import T_State
import re
from io import BytesIO
import httpx
from nonebot.log import logger
from PIL import Image
from retrying import retry

generate = on_command("/draw", aliases={"generate"}, priority=5)

API_BASE = "http://127.0.0.1:7860"
ZIP_SIZE = 3072  # 压缩大小，小于该值将压缩 KB
CD_TIME = 30
generate_time = {
  #   qq:上次生成time
}
MP = {
  "mp": 3,  # mp 实时值
  "mp_max": 3,  # mp 总量
  "last_up_time": time.time(),  # mp上次恢复时间
  "up_speed": 1,  # mp 恢复速度
  "up_time": 20,  # mp 恢复间隔时间 s
}

BLOCK_WORDS = r'pee|cum|boob|ass|tit|cock|ahegao|anus|without|bra|tentacle|hairjob|oral|fellatio|deepthroat|gokkun|gag|ballgag|bitgag|tapegag|facial|leash|handjob|groping|areolae|paizuri|piercing|navel|footjob|venus|masturbation|testicles|cum|cuming|tamakeri|clitoris|mons|cameltoe|grinding|facesitting|cervix|cunnilingus|insertion|insertion|penetration|fisting|fingering|peeing|ass|buttjob|spanked|anus|anal|anilingus|enema|stomach|bulge|xray|x-ray|cross-section|internal|cumshot|wakamezake|humiliation|caught|tally|futanari|incest|twincest|pegging|femdom|ganguro|bestiality|gangbang|hreesome|orgy|tribadism|molestation|voyeurism|exhibitionism|spitroast|69|doggystyle|missionary|cowgirl|slave|shibari|bondage|bdsm|pillory|stocks|rope|crotch|hogtie|frogtie|suspension|dildo|vibrator|nyotaimori|vore|amputee|transformation|censored|uncensored|asian'
BLOCK_WORDS_FIND = 'nsfw|nude|r18|porn|hentai|sex|dick|penis|pussy|naked|nudity|nipple|vagina|uncensored|fuck|shit|sexy|genitalia|underwear|vulva|no cloth|not cloth|not wear|no wear|virgin|suck|rape|masturbat|ejaculat'

@generate.handle()
async def handle_first_receive(
  bot: Bot, event: Event, state: T_State, args: Message = CommandArg()
):
  if event.user_id == event.self_id:
    return
  msg_at = MessageSegment.at(event.user_id)
  if event.__getattribute__("message_type") == "private":
    msg_at = ""
  plain_text = args.extract_plain_text()

  # 全局 CD
  if MP["mp"] > MP["mp_max"]:
    MP["mp"] = MP["mp_max"]
  if MP["mp"] < MP["mp_max"]:
    if (time.time() - MP["last_up_time"]) >= MP["up_time"]:
      MP["mp"] += round(
        MP["up_speed"] * ((time.time() - MP["last_up_time"]) / MP["up_time"])
      )
      MP["last_up_time"] = time.time()
    if MP["mp"] <= 0:
      await generate.finish(msg_at + f" 生成技能MP不足，请稍后再试！")

  # 个人技能 cd
  if last_time := generate_time.get(event.user_id):
    if time.time() - last_time <= float(CD_TIME):
      await generate.finish(
        msg_at
        + f" 您的生成技能CD中，请 {round(last_time + CD_TIME - time.time())}s 后再试！"
      )

  generate_time.update({event.user_id: time.time()})
  if plain_text:
    state["generate"] = plain_text


def get_image_urls(event: MessageEvent) -> List[str]:
  message = event.reply.message if event.reply else event.message
  return [i.data["url"] for i in message if i.type == "image" and i.data.get("url")]


# 图片压缩 加和谐
async def zipPic(content, file_type):
  # 打开一个jpg/png图像文件，注意是当前路径:
  im = Image.open(BytesIO(content))
  # 获得图像尺寸:
  width, height = im.size
  # 算出缩小比
  Proportion = int(len(content) / (float(ZIP_SIZE) * 1024))
  logger.info("算出的缩小比:" + str(Proportion))
  if Proportion > 0:
    # 缩放
    im.thumbnail((width // Proportion, height // Proportion))
  width, height = im.size
  logger.info("Resize image to: %sx%s" % (width, height))
  # 和谐
  pim = im.load()
  points = [[0, 0], [width - 1, 0], [0, height - 1], [width - 1, height - 1]]

  try:
    for point in points:
      if file_type == "png":
        im.putpixel((point[0], point[1]), random.randint(0, 255))
      elif file_type == "jpg":
        pim[point[0], point[1]] = (
          random.randint(0, 255),
          random.randint(0, 255),
          random.randint(0, 255),
        )
  except Exception as e:
    logger.error("图片和谐失败！".format(e))
  return im


# 将图片转化为 base64
async def get_pic_base64(content, file_type) -> str:
  # im = Image.open(BytesIO(content))
  im = await zipPic(content, file_type)
  jpeg_image_buffer = BytesIO()
  im.save(jpeg_image_buffer, file_type)
  res = str(base64.b64encode(jpeg_image_buffer.getvalue()), encoding="utf-8")
  return f"data:image/{file_type};base64,{res}", im.size


# 图片下载
# 下载图片
@retry(stop_max_attempt_number=5, stop_max_delay=30 * 1000)
async def request_image(url: str, proxy: bool) -> str:
  try:
    async with httpx.AsyncClient(proxies=get_Proxy(open_proxy=proxy)) as client:
      # referer = re.findall("([hH][tT]{2}[pP][sS]{0,}://.*?)(?:/.*?)", url)[0]
      # headers = {"referer": referer}
      pic = await client.get(url)
      # image/gif, image/png, image/jpeg, image/bmp, image/webp, image/x-icon, image/vnd.microsoft.icon
      if pic.headers["Content-Type"] == "image/jpeg":
        file_type = "jpeg"
      elif pic.headers["Content-Type"] == "image/png":
        file_type = "png"
      elif pic.headers["Content-Type"] == "image/gif":
        file_type = "gif"
      else:
        file_type = "jpeg"
        
      base64, osize = await get_pic_base64(pic.content, file_type)
      return base64, osize
  except BaseException as e:
    logger.error("图片下载失败,将重试 1E:" + str(e))
    raise BaseException


def handle_reply_msg(message_id: int) -> str:
  return f"[CQ:reply,id={message_id}]"


def multiple_replace(string, rep_dict):
  pattern = re.compile("|".join([re.escape(k) for k in sorted(rep_dict,key=len,reverse=True)]), flags=re.DOTALL)
  return pattern.sub(lambda x: rep_dict[x.group(0)], string)


@generate.got("generate", prompt="输入tag,英文")
async def handle_TagImg(bot: Bot, event: MessageEvent, state: T_State):
  image_urls = get_image_urls(event)
  tags = re.sub(r'\r|\n|\t', "", state["generate"]) # 过滤制表符
  # print(tags)

  block_set = set(BLOCK_WORDS.lower().split('|')) # 构造黑名单列表

  _tmp_tags = ' '.join(re.sub(r'\d', '', tags).lower().split()) # 去除所有数字和多余空格，并转为小写
  tags_list = list(re.split(r'\W', _tmp_tags)) + list(re.split(r',|，|_', _tmp_tags)) # 构造检索列表，包含所有通常意义上的单词
  tags_list = filter(None, list(dict.fromkeys(tags_list))) # 去重

  block_f_set = set(BLOCK_WORDS_FIND.lower().split('|')) # 全文匹配黑名单列表
  
  f_tags = ''.join(re.split(r'[^,\w]|_', _tmp_tags))
  f_match = [x for x in block_f_set if x in f_tags or x in _tmp_tags] # 直接做检索匹配

  match = [x for x in tags_list if x in block_set] + f_match # 合并匹配列表

  if match:
    msg_at = MessageSegment.at(event.user_id) if event.user_id else ""
    await generate.send(msg_at + f"prompt包含黑名单关键词，拒绝处理\n{match}")
    return
    
  MP["mp"] -= 1
    
  tags = multiple_replace(tags, { "{": "(", "}": ")" })
  
  seed = random.randint(0, 2**32)
      
  opts = {
    "method": "DDIM",
    "step": 20,
    "cfg_scale": 11,
    "denoising_strength": 0.55,
    "seed": seed,
    "size": [512, 768]
  }

  if image_urls:
    # print(image_urls)
    image_base64, osize = await request_image(image_urls[0], False)
    opts["method"] = "Euler a"
    opts["step"] = 45
    opts["image_base64"] = image_base64

    if 5/6 < osize[0]/osize[1] < 6/5:
      opts["size"] = [640, 640]
    elif osize[0] > osize[1]:
      opts["size"] = [768, 512]

  start = time.time()
  await generate.send("开始AI绘图...")
  data, meta, err = await dowimg(tags, opts, False)
  end = time.time()
  if not err:
    img_str = MessageSegment.image(file="base64://" + data)
    # img_str = img_str + f"\n生成耗时 {round(end - start, 3)}s"
    if meta:
      img_str += meta
    # img_str += f"\nseed: {seed}"
    img_str += MessageSegment.reply(event.message_id)
  else:
    img_str = MessageSegment.text("绘制失败, " + err)

  await bot.send_msg(
    user_id=event.user_id if isinstance(event, PrivateMessageEvent) else 0,
    group_id=event.group_id if isinstance(event, GroupMessageEvent) else 0,
    message=img_str,
  )


# 代理
def get_Proxy(open_proxy: bool) -> dict:
  if not open_proxy:
    return {}
  proxy = nonebot.get_driver().config.dict()["rss_proxy"]
  return httpx.Proxy(
    url="http://" + proxy,
  )


async def dowimg(prompt: str, opts: dict, proxy: bool) -> str:

  try:
    async with httpx.AsyncClient(
      proxies=get_Proxy(open_proxy=proxy), timeout=100
    ) as client:
      data = {
        "fn_index": 13, # txt2img
        "data": [
        "masterpiece, best quality, " + prompt, # 输入词组
        "nsfw, r18, r18-g, lowres, bad anatomy, bad hands, bad feet, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry", # 负关键词组
        "None",
        "None",
        opts["step"], # 采样次数
        opts["method"], # 采样方法
        False,
        False,
        1,
        1,
        opts["cfg_scale"], # scale
        opts["seed"], # seed
        -1,
        0,
        0,
        0,
        False,
        opts["size"][1], # 高度
        opts["size"][0], # 宽度
        False,
        opts["denoising_strength"],
        0,
        0,
        #"0.0001",
        #0.9,
        #5,
        #"None",
        #False,
        #"",
        #0.1,
        #False,
        "None",
        "",
        False,
        False,
        None,
        "",
        "Seed",
        "",
        "Nothing",
        "",
        True,
        True,
        False,
        None,
        "",
        ""
        ]
      }
      if "image_base64" in opts:
        data = {
          "fn_index": 33, # img2img
          "data": [
            0,
            "masterpiece, best quality, " + prompt, # 输入词组
            "nsfw, r18, r18g, lowres, bad anatomy, bad hands, bad feet, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry", # 负关键词组
            "None",
            "None",
            opts["image_base64"], # image base64
            None,
            None,
            None,
            "Draw mask",
            opts["step"], # 采样次数
            opts["method"], # 采样方法
            4,
            "fill",
            False,
            False,
            1,
            1,
            opts["cfg_scale"], # scale
            opts["denoising_strength"], # denoising strength
            opts["seed"], # seed
            -1,
            0,
            0,
            0,
            False,
            opts["size"][1], # 高度
            opts["size"][0], # 宽度
            "Crop and resize",
            False,
            32,
            "Inpaint masked",
            "",
            "",
            #"0.0001",
            #0.9,
            #5,
            #"None",
            #False,
            #"",
            #0.1,
            #False,
            "None",
            "",
            True,
            True,
            "",
            "",
            True,
            50,
            True,
            1,
            0,
            False,
            4,
            1,
            "",
            128,
            8,
            [
              "left",
              "right",
              "up",
              "down"
            ],
            1,
            0.05,
            128,
            4,
            "fill",
            [
              "left",
              "right",
              "up",
              "down"
            ],
            False,
            False,
            None,
            "",
            "",
            64,
            "None",
            "Seed",
            "",
            "Nothing",
            "",
            True,
            True,
            False,
            None,
            "",
            ""
          ]
        }
      pic = await client.post(
        f"{API_BASE}/api/predict/",
        json=data,
      )
      res = pic.json()
      # print(data)
      # print("===========")
      if "data" in res:
        image_url = f"{API_BASE}/file={res['data'][0][0]['name']}"
        image_base64, _ = await request_image(image_url, False)
        image_base64 = image_base64.split(",")[1]
        meta = ""

        metaJson = json.loads(res["data"][1])
        meta += f"\nSteps: {metaJson['steps']}, Sampler: {metaJson['sampler']}, CFG scale: {metaJson['cfg_scale']}, Seed: {metaJson['seed']}, Size: {metaJson['width']}x{metaJson['height']}, Model hash: {metaJson['sd_model_hash']}"

        metaRegex = re.search(r"<div class='performance'>(.*)<\/p><\/div>", res["data"][2], re.I)
        if metaRegex:
          meta += "\n" + re.sub(r'<[^<]+?>', "", metaRegex.group(1))
        
        return image_base64, meta, None
      elif "detail" in res:
        return None, None, res["detail"][0]["msg"]
      elif "error" in res:
        return None, None, res["error"] if res["error"] else "backend failed."
      else:
        return  None, None, pic.text

  except BaseException as e:
    logger.error("图片下载失败,将重试 1E:" + str(e))
    raise BaseException
