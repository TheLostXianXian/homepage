/* eslint-disable prettier/prettier */
/**
 * 返回目录的json文件
 * 实际每个目录中都会有一个.和..的目录名
 * 实际指向当前和父级目录
 * 根目录也存在这两个目录名，但都表示自己
 */
const FILE_LIST = {
  name: "/",
  mark: [0],
  type: "dir",
  children: [
    {
      name: "baiwei",
      type: "dir",
      alias: "~",
      mark: [0, 0],
      children: [
        {
          name: "blog",
          mark: [0, 0, 0],
          type: "dir",
          children: [
            {
              name: "goToBlog.sh",
              type: "file",
              mark: [0, 0, 0, 0],
              content: "hello world /n goToBlog.sh nihao."
            }
          ]
        },
        {
          name: "contact",
          type: "dir",
          mark: [0, 0, 1],
          children: [
            {
              name: "contact.txt",
              type: "file",
              mark: [0, 0, 1, 0],
              content:
                "# Contact Me<br>- QQ: 776530912 <br>\
              - Email: <a target=\"_blank\" rel=\"noopener\" href=\"mailto:lovelyxiaod@gmail.com\">lovelyxiaod@gmail.com</a><br>\
              - Github: <a target=\"_blank\" rel=\"noopener\" href=\"https://github.com/TheLostXianXian\">https://github.com/TheLostXianXian</a><br>\
              - Blog: <a target=\"_blank\" rel=\"noopener\" href=\"https://github.com/TheLostXianXian/blog/issues\">https://github.com/TheLostXianXian/blog/issues</a><br>"
            },
            {
              name: "leaveMessage.sh",
              // sh文件的result可能为找不到命令
              // 感觉这功能没必要0.0,留了邮箱还留啥言.还要写接口,保存了也不会看.
              type: "file",
              mark: [0, 0, 1, 1],
              content: "hello world /n leaveMessage.sh nihao."
            }
          ]
        },
        {
          name: "projects",
          type: "dir",
          mark: [0, 0, 2],
          children: [
            {
              name: "projects.txt",
              type: "file",
              content: "占位https://github.com/TheLostXianXian"
            }
          ]
        }
      ]
    },
    {
      // 后端写一个发送简历的接口
      name: "README.md",
      type: "file",
      mark: [0, 1],
      sudo: true,
      content:
        "Repo: https://gitlab.com/TheLostXianXian/homepage<br> \
      ## 前言 \
      一直想建个个性一点的小网站. 话不多说, 放码过来."
    }
  ]
}
const CMD_LIST = [
  "cd",
  "ls",
  "cat",
  "uname",
  "clear",
  "help",
  "pwd",
  "sudo",
  "screenfetch",
  "./",
  "../",
  "/"
]

//     .__________________________.
//     | .___________________. |==|
//     | | ................. | |  |
//     | | ::::Apple ][::::: | |  |
//     | | ::::::::::::::::: | |  |
//     | | ::::::::::::::::: | |  |
//     | | ::::::::::::::::: | |  |
//     | | ::::::::::::::::: | |  |
//     | | ::::::::::::::::: | | ,|
//     | !___________________! |(c|
//     !_______________________!__!
//    /                            \
//   /  [][][][][][][][][][][][][]  \
//  /  [][][][][][][][][][][][][][]  \
// (  [][][][][____________][][][][]  )
//  \ ------------------------------ /
//   \______________________________/

export { FILE_LIST, CMD_LIST }
