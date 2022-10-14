const defaultPreset = {
  name: 'Default',
  prompt: '',
  negative: 'lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, bad feet',
  step: 30,
  method: 'Euler a',
  width: 512,
  height: 768,
  scale: 11.0
}
const presetList = [
  {
    name: '猫猫1',
    prompt: '{{masterpiece}}, best quality, illustration, 1 girl, {loli}, beautiful detailed eyes, beautiful detailed water, beautiful detailed sky, sunshine, road, beautiful, {shorts}, cinematic lighting, wet clothes, {red eyes}, {white hair}, cat ears, pink, cat, cute, small, tail, t-shirt',
    step: 20,
    method: 'DDIM',
    width: 512,
    height: 768,
    scale: 7.0
  },
  {
    name: '猫猫2(NSFW)',
    prompt: 'young loli, female child, young child, toddler, kawaii face, cat ear, black longhair, gradient red eyes, tears, small breast, looking at viewer, full nudity, spread legs, blush, saliva, lying on bed, ((anus)), (vagina), spread pussy, (nipple), naughty_face, arms behind back, cum in anus, cum in vagina'
  },
  {
    name: '猫猫3',
    prompt: 'masterpiece, best quality, 1 girl, animal ears, blue yellow eyes, white flower hair ornament, white flower sea, cute face, long hair, white hair, star in eye, look at viewer, small chest, red scarf, white dress, seiza, white legwear',
    negative: 'nsfw, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry',
    step: 50
  },
  {
    name: '猫猫4',
    prompt: 'masterpiece, looking at viewer, white hair, cat paws, long hair, hair ornament, hair flower, cute, white flower, white_socks, parted lips, dynamic angle, blurry, shirt, Cat_ ears, loose coat, ((Blue pick dye)), little girl, wet_queen_dress, [female_child:1.4], see_through',
    negative: 'lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry'
  },
  {
    name: '猫猫5',
    prompt: 'masterpiece, best qualtry, loli, animal ears, blue eyes, hair ornament, sea, wet, cute face, long hair, white hair, star in eye, look at viewer, small chest, light blue scarf, school uniform, seiza, white legwear'
  },
  {
    name: '猫猫6',
    prompt: 'extremely detailed CG, HD wallpaper, ((masterpiece)), best quality, illustration, 1 girl, loli, cat ear, beautiful detailed eyes, beautiful detailed sky, beautiful detailed water, cinematic lighting, dramatic angle, sailor dress, wet clothes, maidoutfit'
  },
  {
    name: '猫猫7(NSFW)',
    prompt: 'masterpiece, high quality, best quality, lighting, detailed, illustration, nsfw, loli, skin, fang, hair, eyes, navel'
  },
  {
    name: '猫猫8',
    prompt: '((1girl)), ((solo)), ((masterpiece)), best quality, illustration, (loli), beautiful detailed eyes, ((cat_ear)), ((white_hair)), red_eyes, sad, cute, tail, t-shirt, closed_mouth, blush, white_shirt, looking_at_viewer, school uniform, beautiful detailed eyes, blue background'
  },
  {
    name: '猫猫9',
    prompt: '(((masterpiece))), ((best quality)), flat chest, ((loli)), (one girl), very long light white hair, beautiful detailed blue eyes, aqua eyes, white robe, cat ears, (flower hairpin), (surrounded by beautiful detailed blue flowers), sunlight, light smile, beautiful detailed blue necklace, see-through, flower request'
  },
  {
    name: '猫猫10',
    prompt: 'masterpiece, looking at viewer, see_through_raincoat, white hair, cat paws, long hair, hair ornament, hair flower, (loli:1.4), white_flower, white_socks, parted lips, blurry, shirt, Cat_ears, loose coat, ((Blue pick dye)), wet_queen_dress, fairy-tale'
  },
  {
    name: '猫猫11',
    prompt: '(young loli), ((extremely detailed)), ((unity 8k wallpaper)), ((masterpieces)), ((highly detailed)), (an extremely delicate and beautiful), (1girl), gradient blonde pink very long hair, m-shaped bangs, one braid made of bangs, heterochromatic pupils, ((one blue eye)) and ((one pink eye)), (((heart ahoge))), (((heart hair))), (black beret), cat ears, cat tail, black trench coat, white and gold lace, very oversized sleeves, white shirt, purple and pink striped bow tie, red pleated skirt, (white thighhighs), smile, cute, flat chest, red and white ribbon hair ornament, sitting on a chair in the library'
  },
  {
    name: '猫猫12',
    prompt: 'masterpiece, looking at viewer, see_through_raincoat,white hair, cat paws , long hair, hair ornament, hair flower, [loli:1.4], white_flower,white_socks ,parted lips, blurry,shirt, Cat_ ears,loose coat,((Blue pick dye)),wet_queen_dress,fairy-tale'
  },
  {
    name: '海中少女1',
    prompt: '((masterpiece)), best quality, illustration, 1 girl, beautiful detailed eyes, beautiful detailed sky, beautiful detailed water, cinematic lighting, dramatic angle, sailor dress, wet clothes'
  },
  {
    name: '海中少女2',
    prompt: '((masterpiece)), best quality, illustration, 1 girl, beautiful, beautiful detailed sky, catgirl, beautiful detailed water, cinematic lighting, dramatic angle, Grey T-Shirt, (few clothes), (yuri), (medium breasts), white hair, cat ears, masturbation, bare shoulders, (gold eyes), wet clothes'
  },
  {
    name: '海中少女3',
    prompt: '((masterpiece)), best quality, illustration, 1 girl, beautiful detailed eyes, beautiful detailed sky, beautiful detailed water, cinematic lighting, yuri, dramatic angle, sailor dress, ( wet clothes), few clothes, bare shoulders, small_breasts, masturbation, sex'
  },
  {
    name: '海中少女3(NSFW)',
    prompt: '((masterpiece)), best quality, illustration, 1 girl, beautiful detailed eyes, beautiful detailed sky, beautiful detailed water, cinematic lighting, yuri, dramatic angle, sailor dress, ( wet clothes), few clothes, bare shoulders, small breasts, masturbation, sex, nsfw, spread leg, doggystyle, lying, on bed'
  },
  {
    name: '海中少女4',
    prompt: '((masterpiece)), best quality, illustration, 1 girl, beautiful detailed eyes, beautiful detailed sky, beautiful detailed water, cinematic lighting, dramatic angle, Grey T-Shirt, (few clothes), yuri, (big breasts), white hair, cat ears, gold eyes, wet clothes, masturbation, catgirl, thighhighs, bare shoulders, masturbation'
  },
  {
    name: '海中少女5',
    prompt: '((masterpiece)), best quality, illustration, 1 girl, beautiful, beautiful detailed sky, catgirl, beautiful detailed water, cinematic lighting, dramatic angle, light aero blue T-Shirt, (few clothes), (yuri), (medium breasts), light aero blue hair, cat ears, bare shoulders, (golden eyes), wet clothes, underwater, hold breath, bubbles',
    width: 768,
    height: 512
  },
  {
    name: '海中少女6',
    prompt: '((masterpiece)), best quality, illustration, 1 girl, loli, beautiful detailed eyes, beautiful detailed sky, beautiful detailed water, cinematic lighting, dramatic angle, sailor dress, wet clothes'
  },
  {
    name: '海中少女7',
    prompt: '((masterpiece)), best quality, illustration, 1 girl, small breast, beautiful detailed eyes, beautiful detailed sky, beautiful detailed water, cinematic lighting, dramatic angle, sailor dress, wet clothes, bikini, sideboob, white shirt, long sleeves, hoodie, midriff, jacket, midriff, white bloomers, frills'
  },
  {
    name: '海中少女8(NSFW)',
    prompt: '((masterpiece)), (best quality), illustration, 1 girl, loli, beautiful detailed eyes, beautiful detailed sky, beautiful detailed water, cinematic lighting, dramatic angle, smile, naked, small breasts, (sweat), pussy juice'
  },
  {
    name: '银色短卷发少女',
    prompt: '(((masterpiece))), best quality, illustration, dark background, sunlight, beautiful detailed eyes, 1girl, expressionless, blue eyes, (((white short hair))), ((wavy hair)), (((dishevled hair))), messy hair, long bangs, hairs between eyes, ((((white bloomers)))), ((open clothes))'
  },
  {
    name: '红黑色系短发少女',
    prompt: 'an extremely delicate and beautiful girl, wide view, cold attitude, red pupils, short hair, white hair, multicolored hair, black jacket, tie, hair ornament hair clip, she looks very relaxed, side face, white atmosphere, 1girl, (((ink wash painting))), white background, clean blackwhite clothes'
  },
  {
    name: '红发少女',
    prompt: '((masterpiece)), best quality, illustration, 1 girl, shakugan no shana, small breast, beautiful detailed eyes, beautiful detailed sky, beautiful detailed water, cinematic lighting, dramatic angle'
  },
  {
    name: '粉色卷发少女',
    prompt: '(((masterpiece))), best quality, illustration, dark background, sunlight, beautiful detailed eyes, 1girl, expressionless, purple eyes, (((deep pink hair))), ((wavy hair)), (((disheveled hair))), messy hair, long bangs, hairs between eyes, ((((white bloomers)))), extremely detailed, (open clothes), sitting',
    negative: 'trans, dickgirl, futa, futanari, (extra nipple), (extra breast), out of frame, amputee, mutated, mutation, deformed, severed, dismembered, corpse, poorly drawn, bad anatomy, blur, blurry, lowres, bad hands, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality'
  },
  {
    name: '粉色色气少女(NSFW)',
    prompt: '(an extremely delicate and beautiful), ((masterpiece)), illustration, (extremely detailed cg), beautiful detailed eyes, ahoge, small nipples, cute face, best qualtry, open clothes, flat chest, white shirt, white stocking, pink eyes, pleated skirt, slobber, squat, saliva, sweating, white underpants, masturbate by hand, pink wavy hair, wet clothes'
  },
  {
    name: '嘉然😘',
    prompt: 'best quality, masterpiece, illustration, 1girl, loli, cute, light brown hair, yellow star hair ornament, blue eye, big bow, red pink bow, (a bow on top of the head),looking at viewer, wet clothes, beautiful detailed water, official art'
  },
  {
    name: '嘉然🤤',
    prompt: 'best quality, masterpiece, beautiful detailed blue eyes, ((1little girl)), light brown hair, bangs, blush, bow, brown skirt, collarbone, cowboy shot, sidelocks, hair between eyes, hair bow, pink jacket, long hair, open clothes, open jacket, small pink nipples, open mouth, paw pose, red bow, shirt, sidelocks, simple background, skirt, white background, white shirt, ((((little round breast)))), ((yellow star hair ornament))'
  },
  {
    name: '嘉然🥵(NSFW)',
    prompt: 'masterpiece, best quility, 1young girl, cinematic lighting, dramatic angle, beautiful detailed blue eyes, (light brown hair:1.25), long hair, (big red bow behind hair:1.5), (oval face), embarrassed face, (middle round breasts), (small pink nipples:1.2), tiny areola, nude, (yellow star hair ornament:1.15), beautiful detailed scene'
  },
  {
    name: '向晚😽',
    prompt: 'best quality, masterpiece, twintails, 1girl, cute, blue eyes, beautiful detailed blue eyes, (blue hair), purple hair, very long hair, sleeveless, [white dress], sleeveless dress, blue nails, looking at viewer, smile, hair ornament, eyebrows visible through hair, blush, hair ribbon, nail polish, hair between eyes, white background, (floating hair), official art, full body'
  },
  {
    name: '兔耳少女',
    prompt: '(((masterpiece))), ((best quality)), flat chest, ((loli)), (one girl), very long light white hair, beautiful detailed red eyes, aqua eyes, white robe, (beautiful detailed red collar), parted lips, original, rabbit ears, forest, sunlight, wet, bare shoulders, see-through, wariza, (flower field), (beautiful detailed white head flower), garland, white legwear, hairpins'
  },
  {
    name: '猫耳花嫁',
    prompt: '(((masterpiece))), ((best quality)), flat chest, ((loli)), (one girl), very long light white hair, beautiful detailed red eyes, aqua eyes, white robe, cat ears, (flower hairpin), (surrounded by beautiful detailed flowers), sunlight, light smile, beautiful detailed blue necklace, see-through, flower request, sun'
  },
  {
    name: '双色长筒袜',
    prompt: 'masterpiece, best qualtry, ((1girl)), loli, animal ears, blue eyes, hair ornament, sea, cute face, long hair, white_hair, blue eye, look at viewer, small chest, (school uniform), [(black_thighhighr:1.0):(white_thighhighr:1.0):(single_thighhigh:1.5)], (profile:1.2), blush, back hands'
  },
  {
    name: '黑发少女1',
    prompt: '((masterpiece)), best quality, twintails, illustration, 1 girl, small breast, beautiful detailed eyes, beautiful detailed sky, beautiful detailed water, cinematic lighting, dramatic angle, (((back to the viewer)))'
  },
  {
    name: '黑发少女2',
    prompt: '((masterpiece)), best quality, twintails, illustration, 1girl, small breast, beautiful detailed eyes, beautiful detailed sky, beautiful detailed water, cinematic lighting, dramatic angle, (((back to the viewer))), {an extremely delicate and beautiful}, medium_breasts, black chemise, black ribbon, grey_hair, blue eyes, open mouth, wet clothes, highly detailed'
  },
  {
    name: '大奶子姐姐1',
    prompt: '(an extremely delicate and beautiful), best quality, ((masterpiece)), illustration, (extremely detailed cg), ((beautiful detailed eyes)), kamen rider, Amber eyes, ahoge, light blue hair, very long hair, big breasts, outdoors, close up, solo, golden star hairpin, star earrings, smiling, Snapchat selfie, studio photography'
  },
  {
    name: '大奶子姐姐2',
    prompt: 'extremely detailed wallpaper, masterpiece, pure white, teen, sex, purple eyes, long white hair, cinematic lighting, look at viewer, beautiful detailed eyes, beautiful detailed sky, beautiful detailed snow, dramatic angle, wet clothes, wet hair, upper body, studio photography, ((alphes_style))'
  },
  {
    name: '大奶子姐姐3',
    prompt: '(an extremely delicate and beautiful), best quality, ((masterpiece)), illustration, (extremely detailed cg), ((beautiful detailed eyes)), 1Young woman, Long white hair, red eyes, Metal combat suit'
  },
  {
    name: '涩图1(NSFW)',
    prompt: 'masterpiece, best quality, lighting, detailed, illustration, nsfw, loli, skin, fang, hair, eyes, navel',
  },
  {
    name: '涩图2(NSFW)',
    prompt: 'masterpiece, best quality, solo seductive small sweat blush 1girl masturbation against [desk] standing (((orgasm))) opalescent eyes with dishevled messy white streaked hair [in open shirt:with white pantie:0.5] in indoors, hydrophobic wet cream dripping [pussy] ejaculation squirting, presenting, looking at viewer, fluorescent cyberpunk city, radiant [infrared:ultraviolet:0.5] blacklight accent lighting, side ponytail, white hair, stick out tongue',
  },
  {
    name: '涩图3(NSFW)',
    prompt: '((masterpiece)),((best quality))((loli)),((hoshino\(blue_archive\))),long hair,(pink_hair),bangs,bedroom,blush,(small breasts),(heterochromia_blue_yellow),hair between eyes,halo,nsfw,navel,1 girl,facing viewer,spread legs,shaved_pussy,ahegao,fucked_silly,1 man,cum,ejaculation,highly detailed,uncensored',
    negative: 'lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts,signature, watermark, username, blurry, artist name,bad feet',
    step: 150,
    width: 640,
    height: 384,
    scale: 6
  },
  {
    name: '夜晚撑伞少女',
    prompt: 'dark lighting, spotlight, masterpiece, best quality, flat color, reflection, chromatic aberration, illustration, 1girl,beautiful detailed eyes, looking through umbrella, looking back, gradient multicolored irresident shiny disheveled white hair , blue detailed multicolored eyes , white hoodie, transparent translucent waterclothes, transparent translucent umbrella, holding umbrella , waterdrops on umbrella, city, night',
    negative: 'lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, bad feet',
    step: 50,
    scale: 7
  },
  {
    name: '菠萝饭',
    prompt: 'Extremely detailed CG unity 8k wallpaper,150g rice, 200g curry roux, 300g beef, 2 onions,1 pineapple, 20g butter, 1 tablespoongrated garlic,a pinch of salt and pepper, 1 bay leaf, 1 tablespoon honey',
  },
  // {
  //   name: '大奶子姐姐3',
  //   prompt: 'nude 1girl [reclining:bath:0.6] [urinal:bathtub:0.6] in (wet cream white [translucent:0.6] [goo:fluid:0.4]:1.5), cum on body face , (wet cream dripping pussy:1.2)',
  //   negative: 'lowres, bad anatomy, bad hands, bad legs, text, error, cropped, worst quality, extra arms, ((extra legs)), low quality, normal quality, blurry, deformed, ugly, full, latex, bodysuit, leather',
  //   step: 19,
  //   method: 'DDIM',
  //   scale: '6',
  //   clip: 2
  // }
]

function querySelector(...args) {
  return gradioApp()?.querySelector(...args)
}

function querySelectorAll(...args) {
  return gradioApp()?.querySelectorAll(...args)
}

function reload_ui() {
  querySelector('#request_notifications ~ div > .gr-button-primary')?.click()
}

function add_custom_ui() {
  if (!document.getElementsByTagName('gradio-app').length) {
    requestAnimationFrame(add_custom_ui)
    return
  }

  if (querySelector('#custom_preset')) return

  const $quicksettingsEl = querySelector('#tab_txt2img')
  if (!$quicksettingsEl) {
    requestAnimationFrame(add_custom_ui)
    return
  }

  const customEl = document.createElement('fieldset')
  customEl.id = 'custom_preset'
  customEl.className = 'flex flex-wrap w-full p-2 my-2 gap-2 border-solid border border-gray-300 rounded-sm text-sm'

  const colorList = ['red', 'blue', 'green', 'orange']

  customEl.innerHTML = `
    <legend class="text-xs text-gray-500">预置参数</legend>
    ${presetList.map((item, index) => {

    const color = colorList[index % colorList.length]
    const el = `<button class="text-${color}-500" data-name="${item.name}" data-color="${color}">${item.name}</button>`

    return el
  }).join('')}`

  function changeVal(selector, value) {
    const el = querySelector(selector)
    el.value = value

    const event = new Event('input')
    Object.defineProperty(event, 'target', { writable: false, value: el });
    el.dispatchEvent(event)
  }

  customEl.addEventListener('click', (e) => {
    const { target } = e
    const { dataset } = target

    if (dataset.name) {
      const preset = presetList.find(item => item.name === dataset.name)

      const {
        name,
        prompt,
        negative,
        step,
        method,
        width, height,
        scale
      } = Object.assign({}, defaultPreset, preset)

      console.log('使用预置参数 %s', name, preset);

      const prevActiveEl = target.parentNode.querySelector('button.active')
      if (prevActiveEl) {
        const { color } = prevActiveEl.dataset
        prevActiveEl.className = `text-${color}-500`
      }
      target.className = 'active text-base text-white bg-blue-400 px-1 rounded-sm'

      changeVal('#txt2img_prompt textarea', prompt)
      changeVal('#negative_prompt textarea', negative)
      changeVal('#range_id_0', step)
      querySelector(`#txt2img_sampling input[name="radio-txt2img_sampling"][value="${method}"]`)?.click()
      changeVal('#range_id_1', width)
      changeVal('#range_id_2', height)
      changeVal('#range_id_6', scale)
    }
  })

  $quicksettingsEl.insertAdjacentElement('afterbegin', customEl)

  console.log('预置参数面板添加成功, 当前参数列表', presetList)

  const $footer = querySelector('footer')
  $footer.classList.add('items-center')
  const counter = document.createElement('img')
  $footer.insertAdjacentElement('beforeend', counter)
  counter.style = 'height: 44px; margin-left: 4px;'
  counter.src = 'https://count.getloli.com/get/@' + location.host
}

add_custom_ui()