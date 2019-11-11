<template>
  <div class="homepage" ref="container">
    <v-header></v-header>
    <history :history="resultHistory"></history>
    <command-line>
      <template
        v-if="mode === 'normal' || mode !== 'interactive'"
        v-slot:prefix
      >
        <span class="prefix">{{
          `[${userName}@${machineName} ${pathName}]# `
        }}</span>
      </template>
      <template v-slot:command>
        <span
          v-focus
          contenteditable
          spellcheck="false"
          autocomplete="off"
          autocorrect="off"
          :class="['command-input', currentInput === '' ? 'input-empty' : '']"
          v-text="currentInput"
          ref="input"
          @input="handleInput"
          @keydown.enter.prevent="executeCommand"
          @keydown.tab.prevent="executeCommand"
          @keydown.up.prevent="executeCommand"
          @keydown.down.prevent="executeCommand"
        ></span>
        <!-- <span
                  @focus="onInputFocus"
          @blur="onInputBlur"
          class="auto-complete"
          v-if="autoCompleteText"
          v-text="autoCompleteText"
        >
        </span> -->
      </template>
      <!-- <template v-slot:result>
        <p>
          <span v-for="(result, index2) in item.result" :key="index2">{{
            result
          }}</span>
          <span v-if="mode === 'interactive'">{{ interactiveInput }}</span>
        </p>
      </template> -->
    </command-line>
  </div>
</template>

<script>
import VHeader from "@/components/header"
import CommandLine from "@/components/command-line"
import History from "@/components/history"

import { FILE_LIST } from "@/common/js/config.js"

export default {
  name: "Homepage",
  data: function() {
    return {
      currentInput: "",
      currentPathMark: [0, 0],
      // 有&&,||存在时多命令模式, 此时输出结果不立即重置input(?有必要?)
      resetInput: false,
      userName: "baiwei",
      machineName: "xlxlx.xyz",
      lock: false,
      mode: "normal",
      interactiveInput: "",
      tabMode: false,
      focus: true,
      resultHistory: [],
      commandHistory: [],
      resultListStr: ""
    }
  },
  created() {
    const file_list_bak = JSON.parse(JSON.stringify(FILE_LIST))
    this.pathConfigObj = this.handlePath(file_list_bak, file_list_bak)
  },
  mounted() {
    this.$nextTick(() => {
      window.onblur = () => {
        console.log("blur")
      }

      window.onfocus = () => {
        console.log("focus")
        this.focusInput()
      }
    })
  },
  computed: {
    currentPathObj() {
      const mark = this.currentPathMark.slice()
      let list = this.pathConfigObj
      if (mark.length === 1) {
        return list
      }
      mark.shift()
      while (mark.length) {
        const num = mark.shift()
        list = list.children[num]
      }
      return list
    },
    pathName() {
      return this.currentPathObj.alias || this.currentPathObj.name
    },
    pathFullName() {
      const mark = this.currentPathMark.slice()
      let list = this.pathConfigObj
      let ret = ""
      if (mark.length === 1) {
        return "/"
      }
      mark.shift()
      while (mark.length) {
        const num = mark.shift()
        ret = ret + "/" + list.children[num].name
        list = list.children[num]
      }
      return ret
    }
  },
  watch: {
    // 如果指令历史变，那么表示有新输入，那么historyCursorIndex必须变到最后
    commandHistory: {
      immediate: true,
      handler(newVal) {
        this.historyCursorIndex = newVal.length
      }
    }
  },
  methods: {
    // 执行输入的命令， 应该有两种tab和enter， 先挖坑
    executeCommand(event) {
      // 按下Tab键， 只有一个匹配自动补全， 多个匹配显示结果
      // 分指令和目录，文件等等。。。。
      // console.log("event.key", event)
      if (event.key === "Tab") {
        // autoCompleteList
        // 实时解析命令?
        // 也要考虑&&和||的问题(暂时不考虑)
        // tab补全后 按下tab为空格键, 若按下tab未补全, 则显示所有补全项(保存个状态)
        // 直接给input追加空格v-text不显示
        let completeStr = this.getAutoCompleteStr(this.currentInput)
        if (/\w+$/.test(this.currentInput)) {
          if (!completeStr) {
            completeStr = " "
          }
        }
        this.currentInput += completeStr
        this.putCursorLast()
        // return
      }
      // 按下Enter， 执行输入
      // 空字符串加入结果历史，但不加入指令历史
      // 同时滚动条滚动最底部
      if (event.key === "Enter") {
        // 逻辑操作符还未实现
        const commandStack = this.runCommand()
        const currentPathName = this.pathName
        const computeStack = []
        let result = []
        if (!commandStack.length) {
          return
        }
        if (commandStack.length === 1) {
          this.resetInput = true
          commandStack[0]()
        }
        for (let i = 0; i < commandStack.length; i++) {
          if (
            typeof commandStack[i] === "function" ||
            typeof commandStack[i] === "boolean"
          ) {
            computeStack.push(commandStack[i])
          } else {
            let c1 = computeStack.pop()
            if (typeof c1 === "boolean") {
              const ret = c1
              if (i === commandStack.length - 1) {
                c1 = () => {
                  this.resetInput = true
                  return ret
                }
              } else {
                c1 = () => ret
              }
            } else {
              const fn = c1
              c1 = () => {
                this.resetInput = true
                return fn()
              }
            }
            let c2 = computeStack.pop()
            // if (typeof c2 === "boolean") {
            //   const ret = c2
            //   c2 = () => ret
            // }
            if (typeof c2 === "boolean") {
              const ret = c2
              if (i === commandStack.length - 1) {
                c2 = () => {
                  this.resetInput = true
                  return ret
                }
              } else {
                c2 = () => ret
              }
            } else {
              const fn = c2
              c2 = () => {
                this.resetInput = true
                return fn()
              }
            }
            if (commandStack[i] === "&&") {
              result = c2() && c1()
            } else if (commandStack[i] === "||") {
              result = c2() || c1()
            }
            // 如果有false 说明报错了
            computeStack.push(result)
          }
        }
        // 所有任务执行完成后才渲染结果 不可行
        // 如果遇到交互模式怎么办?
        this.renderResult(currentPathName)
      }
      if (event.key === "ArrowUp") {
        this.historyCursorIndex && this.historyCursorIndex--
        this.currentInput = this.commandHistory[this.historyCursorIndex]
        this.putCursorLast()
        this.scrollToBottom()
      }
      if (event.key === "ArrowDown") {
        this.historyCursorIndex < this.commandHistory.length &&
          this.historyCursorIndex++
        this.currentInput =
          this.commandHistory[this.historyCursorIndex] === undefined
            ? ""
            : this.commandHistory[this.historyCursorIndex]
        this.putCursorLast()
        this.scrollToBottom()
      }
    },
    handleInput() {
      // 光标问题，要考虑的点很多， 暂时放在这儿，getSelection
      const { input } = this.$refs
      const selection = window.getSelection()
      this.currentInput = input.innerText
      this.$nextTick(() => {
        selection.selectAllChildren(input)
        selection.collapseToEnd()
      })
    },
    putCursorLast() {
      // 让光标移到最后
      // 每当上下移动或者自动补全时,光标会移到开头,hack一下试试
      const { input } = this.$refs
      // const range = document.createRange()
      const selection = window.getSelection()
      this.$nextTick(() => {
        selection.selectAllChildren(input)
        selection.collapseToEnd()
      })
    },
    //  监听全局按键?
    //  全局按键和选中之后按键，
    //  要考虑的点也不少
    watchGlobalKeyEvent() {
      const that = this
      document.onkeydown = function(event) {
        that.currentInput += event.key
        // 能输入的才加入
      }
    },
    runCommand() {
      // 用来执行整条输入, doCommand执行单个表达式
      const commandStack = this.parseInput(this.currentInput)
      for (let i = 0; i < commandStack.length; i++) {
        if (typeof commandStack[i] === "object") {
          const obj = commandStack[i]
          commandStack[i] = () => {
            return this.doCommand(obj)
          }
        }
      }
      // 在尾部添加一个渲染函数, 执行渲染操作
      return commandStack
    },
    parseInput(currentInput) {
      // 解析输入的语句拆分成各个表达式
      // 需要考虑运算符优先级，转换成逆波兰表达式并推入栈中
      let current = currentInput.trim()
      // split()的正则为参数时加上(),则可以包含分隔
      const inputList = current.split(/(&&|\|\|)/).map(el => el.trim())
      const commandStack = this.convertToRPN(inputList).map(el => {
        if (el === "||" || el === "&&") {
          return el
        } else {
          return this.parseExpression(el)
        }
      })
      return commandStack
    },
    parseExpression(expression) {
      //  解析表达式，返回对象
      //  如 sudo ls -l a/b/c (暂不考虑，多个param, 多个选项)
      //  解析成 {name: 'ls', option: '-l', param: 'a/b/c', sudo: false}
      //  虽然当前的几个简单指令还没有同时用到参数和选项，但也得考虑进去(情况好多)
      //  sudo后面不能继续跟sudo,sudo 支持option,不过统一报用法错误即可。
      const ret = { name: "", option: "", param: "", sudo: false }
      // 假设存在形如sudo cd -a a/b/c。 解析成对象的代码多且无规律
      const tokenList = expression.split(/\s+/)
      if (/^sudo(\s+|$)/.test(expression)) {
        // 实测， 命令行多个空格，也能正常执行
        ret.sudo = true
        tokenList.shift()
      }
      ret.name = tokenList[0] === undefined ? "" : tokenList.shift()
      let token = tokenList.shift()
      if (token && token.indexOf("-") === 0) {
        ret.option = token
        ret.param = tokenList.length ? tokenList[0] : ""
      } else if (token) {
        ret.param = token
      }
      return ret
    },
    convertToRPN(inputArr) {
      // 将前缀表达式转换为逆波兰表达式（reverse polish notation)
      const operatorStack = []
      const ret = []
      const operatorWeight = {
        "&&": 2,
        "||": 1
      }
      for (const input of inputArr) {
        if (input === "&&" || input === "||") {
          while (operatorStack.length >= 0) {
            const top = operatorStack[operatorStack.length - 1]
            if (
              !operatorStack.length ||
              operatorWeight[input] > operatorWeight[top]
            ) {
              operatorStack.push(input)
              break
            } else {
              ret.push(operatorStack.pop())
            }
          }
        } else {
          ret.push(input)
        }
      }

      while (operatorStack.length) {
        ret.push(operatorStack.pop())
      }
      return ret
    },
    renderResult(currentPathName) {
      // 最后一次渲染, 交互模式和出错暂时先放一边.
      if (this.isClear) {
        this.resultHistory = []
        this.isClear = false
      } else {
        this.resultHistory.push({
          pathName: currentPathName,
          command: this.currentInput,
          result: this.resultListStr
        })
      }
      this.commandHistory.push(this.currentInput)

      if (this.resetInput) {
        this.currentInput = ""
      }
      this.resultListStr = ""
      this.resetInput = false

      this.scrollToBottom()
      // this.$nextTick(() => {
      //   container.scrollTop = container.scrollHeight
      //   this.resetInput = false
      // })

      // return false || true 配合执行运算符优先级
    },
    doCommand(cmdObj) {
      // 输入cmdObj, 返回要渲染的结果或者报错
      // cmdObj = { name: "", option: "", param: "", sudo: false } 是parseExpression的返回值
      // 要返回bool值 为了和之后的逻辑运算符配合
      // 现在的问题是doCommand是运行单个指令, 但是obj(history)是全部指令.
      // obj非必要, command, path直接获取, result拼接.
      // const obj = {
      //   command: this.currentInput,
      //   path: this.pathName,
      //   result: ""
      // }
      // console.log(cmdObj)
      if (cmdObj.name === "cd") {
        if (!cmdObj.param) {
          this.currentPathMark = [0, 0]
        } else {
          // cd 的参数，绝对路径，相对路径, 别名~，.和 .. 以及.，..和前面的各种组合(所以自动补全必须实时计算)
          const res = this.parsePath(
            cmdObj.param,
            this.currentPathObj,
            this.pathConfigObj
          )
          if (!res.error && res.pathObj.type === "dir") {
            this.currentPathMark = res.pathObj.mark
          } else if (res.error) {
            // 不存在
            this.resultListStr += `-bash ${cmdObj.name}: ${res.info}<br>`
          } else {
            this.resultListStr += `-bash ${cmdObj.name}: ${cmdObj.param}: Not a directory<br>`
          }
        }
      } else if (cmdObj.name === "cat") {
        if (!cmdObj.param) {
          // 实测cat没参数是不报错,但会进入多行模式(反正没法正常工作)
          // 但这里让它报错usage: cat [-benstuv] [file ...]
          this.resultListStr += `usage: ${cmdObj.name} [file ...]<br>`
        } else {
          const res = this.parsePath(
            cmdObj.param,
            this.currentPathObj,
            this.pathConfigObj
          )

          if (!res.error && res.pathObj.type === "file") {
            this.resultListStr = res.pathObj.content
          } else if (res.error) {
            this.resultListStr += `-bash ${cmdObj.name}: ${res.info}<br>`
          } else {
            this.resultListStr += `-bash ${cmdObj.name}: ${cmdObj.param}: Is a directory<br>`
          }
        }
      } else if (cmdObj.name === "ls") {
        // 带路径参数和不带路径参数
        // ls显示特点: 会按表格适应排列, 文件名太长, 则每行显示一个.(暂时先不做,逻辑先跑通)
        // console.log(cmdObj)
        if (!cmdObj.param) {
          const { currentPathObj } = this
          currentPathObj.children.forEach(el => {
            this.resultListStr += `${el.name}  `
          })
          this.resultListStr += "<br>"
        } else {
          const res = this.parsePath(
            cmdObj.param,
            this.currentPathObj,
            this.pathConfigObj
          )

          if (!res.error && res.pathObj.type === "dir") {
            res.pathObj.children.forEach(el => {
              this.resultListStr += `${el.name}  `
            })
            this.resultListStr += "<br>"
          } else if (res.error) {
            this.resultListStr += `-bash ${cmdObj.name}: ${res.info}<br>`
          } else {
            // ls 如果是个文件, 那么输出文件名
            this.resultListStr += `${res.pathObj.name}`
          }
        }
      } else if (cmdObj.name === "pwd") {
        this.resultListStr += this.pathFullName
      } else if (cmdObj.name === "help") {
        this.resultListStr +=
          "暂时只支持cd cat clear ls pwd uname && || 和Tab 命令目录自动补全<br>"
      } else if (cmdObj.name === "clear") {
        // 此处需要标记是clear
        this.isClear = true
      } else if (cmdObj.name === "uname") {
        this.resultListStr += "Darwin<br>"
      } else if (cmdObj.name === "screenfetch") {
        this.resultListStr += "🍎<br>"
      } else if (cmdObj.name === "macbook") {
        // 交互模式 等待下一步输入
        // if (this.param) this.mode = "interactive"
        // obj.result = ""
      } else {
        this.resultListStr += `-bash: ${cmdObj.name}: command not found<br>`
      }

      // if (cmdObj.name !== "clear") {
      //   this.resultHistory.push(obj)
      // }
      // this.renderResult()
      return true
    },
    parsePath(path, currentPathObj, pathConfigObj) {
      // 返回, 正确error: 0 {error: 0, pathObj: {目录也是一种文件}, info: ""}
      // 不是个路径 || 没有该路径
      // 未考虑path为空
      let res
      const pathArr = path.split(/\/+/).filter(el => el !== "")
      if (!path) {
        return {
          error: 1,
          pathObj: {},
          info: "path is empty"
        }
      }
      if (/^\/+/.test(path)) {
        res = pathConfigObj
      } else {
        // 相对路径要通过当前路径计算 只是起点不一样 ~特殊处理
        if (pathArr[0] === "~") {
          res = pathConfigObj.children.find(el => el.alias === "~")
          pathArr.shift()
        } else {
          res = currentPathObj
        }
      }
      for (let i = 0; i < pathArr.length; i++) {
        res = res.children && res.children.find(el => el.name === pathArr[i])
        if (!res) {
          return {
            error: 1,
            pathObj: {},
            info: `${path}: No such file or directory`
          }
        }
      }
      return {
        error: 0,
        pathObj: res,
        info: ""
      }
    },
    handlePath(pathConfigObj, parentPathObj) {
      // 处理路径对象,给他加上.和..
      // 不知道这种循环引用会有啥副作用
      let ret = pathConfigObj
      if (pathConfigObj.name === "." || pathConfigObj.name === "..") {
        return
      }

      if (pathConfigObj.name === "/") {
        pathConfigObj.children.push(
          {
            name: ".",
            type: "dir",
            children: pathConfigObj.children,
            mark: pathConfigObj.mark
          },
          {
            name: "..",
            children: parentPathObj.children,
            mark: parentPathObj.mark
          }
        )
      } else {
        if (
          pathConfigObj.type === "dir" &&
          pathConfigObj.name !== "." &&
          pathConfigObj.name !== ".."
        ) {
          pathConfigObj.children.push(
            {
              name: ".",
              type: "dir",
              children: pathConfigObj.children,
              mark: pathConfigObj.mark
            },
            {
              name: "..",
              type: "dir",
              children: parentPathObj.children,
              mark: parentPathObj.mark
            }
          )
        }
      }
      if (pathConfigObj.children) {
        for (let i = 0; i < pathConfigObj.children.length; i++) {
          this.handlePath(pathConfigObj.children[i], pathConfigObj)
        }
      }
      return ret
    },
    getAutoCompleteStr(input) {
      // 统一全部联想,优先指令.
      // 实际应该返回一个数组, 然后输出第一个元素
      const list = this.getAutoCompleteList(input)
      return list.length ? list[0] : ""
    },
    getAutoCompleteList(input) {
      // 统一全部联想,优先指令.
      // 实际应该返回一个数组, 然后输出第一个元素
      const cmdList = [
        "cd",
        "ls",
        "cat",
        "uname",
        "clear",
        "help",
        "pwd",
        "sudo",
        "screenfetch"
      ]
      let completeList = []
      const inputList = input.split(" ")
      let lastWord = inputList[inputList.length - 1]
      completeList = cmdList
        .filter(el => lastWord && el.indexOf(lastWord) === 0)
        .map(el => {
          return el.slice(lastWord.length)
        })
      if (!completeList.length) {
        // 匹配不到命令, 要去匹配路径
        if (lastWord.indexOf("/") === 0) {
          // 绝对路径
          const lastSlashIndex = lastWord.lastIndexOf("/")
          const parentPathStr = lastWord.slice(0, lastSlashIndex + 1)
          const restPathStr = lastWord.slice(lastSlashIndex + 1)
          const res = this.parsePath(
            parentPathStr,
            this.currentPathObj,
            this.pathConfigObj
          )
          if (!res.error) {
            return res.pathObj.children
              .filter(el => {
                return restPathStr && el.name.indexOf(restPathStr) === 0
              })
              .map(el => {
                // 如果是目录自动追加/
                let ret = el.name.slice(restPathStr.length)
                if (el.type === "dir") {
                  ret += "/"
                }
                return ret
              })
          }
        } else {
          // 相对路径./, a, 和 ~ 开头(~不用计算,因为~只是一个字符根本不用联想)
          const lastSlashIndex = lastWord.lastIndexOf("/")
          let restPathStr = ""
          let parentPathStr = ""
          if (lastSlashIndex === -1) {
            // 相对路径a, 直接在当前路径中找就完事儿了
            restPathStr = lastWord
            return this.currentPathObj.children
              .filter(el => {
                return restPathStr && el.name.indexOf(restPathStr) === 0
              })
              .map(el => {
                let ret = el.name.slice(restPathStr.length)
                if (el.type === "dir") {
                  ret += "/"
                }
                return ret
              })
          } else {
            // 形如./ ~/ 需要求父路径, 然后在返回的res.pathObj.children中找
            parentPathStr = lastWord.slice(0, lastSlashIndex + 1)
            restPathStr = lastWord.slice(lastSlashIndex + 1)
          }
          const res = this.parsePath(
            parentPathStr,
            this.currentPathObj,
            this.pathConfigObj
          )
          if (!res.error) {
            return res.pathObj.children
              .filter(el => {
                return restPathStr && el.name.indexOf(restPathStr) === 0
              })
              .map(el => {
                // 如果是目录自动追加/
                let ret = el.name.slice(restPathStr.length)
                if (el.type === "dir") {
                  ret += "/"
                }
                return ret
              })
          }
        }
      }
      return completeList
    },
    getPathComlete() {},
    onInputFocus() {
      this.focus = true
    },
    onInputBlur() {
      this.focus = false
    },
    focusInput() {
      // if (!this.focus) {
      //   this.putCursorLast()
      // }
      this.putCursorLast()
    },
    scrollToBottom() {
      const { container } = this.$refs
      this.$nextTick(() => {
        container.scrollTop = container.scrollHeight
      })
    }
  },
  components: {
    VHeader,
    CommandLine,
    History
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.homepage {
  width: 100%;
  height: calc(100% - 20px);
  padding-top: 4px;
  font-size: 14px;
  color: #fff;
  text-align: left;
  line-height: 1.5;
  overflow-y: scroll;
  background: #000;
}

.command-input {
  display: inline;
  word-break: break-all;
  // 既换行又像pre标签一样保持多个空格和换行处理.
  white-space: pre-wrap;
  &:focus {
    outline: none;
  }
}

.input-empty {
  padding-left: 1em;
}
</style>
