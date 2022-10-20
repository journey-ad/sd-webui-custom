(function () {
  const { defaultPreset, presetList } = JSON.parse(readFile('ui_custom/preset.json'))

  let labelMap = {} // 提示标签->id引用映射
  // 构造标签引用映射
  function buildLabelReferenceMap(tab = 'tab_txt2img') {
    return [...querySelectorAll(`#${tab} label[for] span`)].reduce((labelMap, span) => {
      const label = span.parentNode,
        key = span.textContent.trim(),
        val = label.getAttribute('for')

      labelMap[key] = val

      return labelMap
    }, {})
  }

  const i18n = JSON.parse(readFile('ui_custom/i18n.json'))
  function translatePage() {
    // const selector = ['tab_txt2img', 'tab_img2img', 'tab_extras', 'tab_pnginfo'].map(tab => `#${tab} label span, #${tab} button`).join(',')
    [...querySelectorAll('label span, fieldset span, button')].forEach(translateEl)

  }
  function translateEl(el) {
    const text = el.textContent.trim()

    if (!text) return

    const translate = i18n[text]

    if (!translate) return

    if (text === translate) return

    el.setAttribute('title', translate)
    el.innerHTML = `<span class="custom_ui__trans_wrapper"><span>${translate}</span>${text}</span>`
  }

  function querySelector(...args) {
    return gradioApp()?.querySelector(...args)
  }

  function querySelectorAll(...args) {
    return gradioApp()?.querySelectorAll(...args)
  }

  // 通过标签选择对应配置项元素
  function querySelectorByLabel(label, tab = 'tab_txt2img') {
    const id = labelMap[tab][label]

    if (!id) return

    return querySelector(`#${id}`)
  }

  // 通过选择器模拟触发修改值
  function changeVal(selector, value) {
    const el = querySelector(selector)
    el.value = value

    const event = new Event('input')
    Object.defineProperty(event, 'target', { writable: false, value: el });
    el.dispatchEvent(event)
  }

  // 通过标签修改值
  function changeValByLabel(label, value, tab = 'tab_txt2img') {
    const id = labelMap[tab][label]

    if (!id) return

    changeVal(`#${id}`, value)
  }

  // Load file
  function readFile(filePath) {
    let request = new XMLHttpRequest();
    request.open("GET", `file/${filePath}`, false);
    request.send(null);
    return request.responseText;
  }

  // 模拟点击重载gradio
  function reload_ui() {
    querySelector('#tab_settings #settings ~ div > .gr-button-primary')?.click()
  }
  window.reload_ui = reload_ui

  // 添加自定义UI
  function add_custom_ui() {
    // 未获取到gradio-app重试
    if (!document.getElementsByTagName('gradio-app').length) {
      requestAnimationFrame(add_custom_ui)
      return
    }

    // 防止重复添加
    if (querySelector('#custom_preset')) return

    // 未获取到注入点dom重试
    const $txt2imgTabEl = querySelector('#tab_txt2img')
    if (!$txt2imgTabEl) {
      requestAnimationFrame(add_custom_ui)
      return
    }

    // 构造标签引用映射
    labelMap = {
      tab_txt2img: buildLabelReferenceMap('tab_txt2img'),
      tab_img2img: buildLabelReferenceMap('tab_img2img'),
      tab_extras: buildLabelReferenceMap('tab_extras'),
      tab_pnginfo: buildLabelReferenceMap('tab_pnginfo'),
    }

    // 翻译页面
    onUiUpdate(translatePage)

    // 添加交换宽高按钮
    const $sizeSettingPanel = querySelectorByLabel('Width')?.closest('.gr-form')
    if ($sizeSettingPanel) {
      $sizeSettingPanel.parentNode.classList.add('flex')
      $sizeSettingPanel.classList.add('w-full')

      const switchWrapper = document.createElement('div')
      switchWrapper.className = 'flex ml-2'

      const switchBtn = document.createElement('button')
      switchBtn.className = 'gr-button gr-button-lg gr-button-secondary'
      switchBtn.textContent = '🔄'
      switchBtn.addEventListener('click', () => {
        const width = querySelectorByLabel('Width').value
        const height = querySelectorByLabel('Height').value

        changeValByLabel('Width', height)
        changeValByLabel('Height', width)
      })

      switchWrapper.appendChild(switchBtn)
      $sizeSettingPanel.insertAdjacentElement('afterend', switchWrapper)
    }

    // 添加自定义预设框
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

    customEl.addEventListener('click', (e) => {
      const { target } = e
      const { dataset } = target

      if (dataset.name) {
        const preset = presetList.find(item => item.name === dataset.name)

        if (!preset) return

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
        changeVal('#txt2img_neg_prompt textarea', negative)
        changeValByLabel('Sampling Steps', step)
        querySelector(`#txt2img_sampling input[name="radio-txt2img_sampling"][value="${method}"]`)?.click()
        changeValByLabel('Width', width)
        changeValByLabel('Height', height)
        changeValByLabel('CFG Scale', scale)
      }
    })

    $txt2imgTabEl.insertAdjacentElement('afterbegin', customEl)

    console.log('预置参数面板添加成功, 当前参数列表', presetList)

    // 添加自定义footer
    const $footer = querySelector('footer')
    $footer.classList.add('items-center')
    const counter = document.createElement('img')
    $footer.insertAdjacentElement('beforeend', counter)
    counter.style = 'height: 44px; margin-left: 4px;'
    counter.src = 'https://count.getloli.com/get/@' + location.host
  }

  add_custom_ui()
})();
