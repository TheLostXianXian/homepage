var FILE_LIST = {
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
              mark: [0, 0, 0, 0]
            }
          ]
        },
        {
          name: "contact",
          type: "dir",
          mark: [0, 0, 1],
          children: [
            {
              name: "contact.md",
              type: "file",
              content: "",
              mark: [0, 0, 1, 0]
            },
            {
              name: "leaveMessage.sh",
              // sh文件的result可能为找不到命令
              type: "file",
              mark: [0, 0, 1, 1]
            }
          ]
        },
        {
          name: "projects",
          type: "dir",
          mark: [0, 0, 2],
          children: [
            {
              name: "projects.md",
              type: "file"
            }
          ]
        }
      ]
    },
    {
      name: "resume.md",
      type: "file",
      mark: [0, 1],
      sudo: true
    }
  ]
}

function handlePath(pathConfigObj, parentPath) {
  // 处理路径对象,给他加上.和..
  // 不知道这种循环引用会有啥副作用
  let ret = pathConfigObj
  if (pathConfigObj.name === "/") {
    pathConfigObj.children.push(
      {
        name: ".",
        type: "dir",
        children: pathConfigObj.children
      },
      {
        name: "..",
        type: "dir",
        children: pathConfigObj.children
      }
    )
    // 第三层没有进去处理?
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
          children: pathConfigObj.children
        },
        {
          name: "..",
          type: "dir",
          children: parentPath.children
        }
      )
    }
  }
  for (let i = 0; i < pathConfigObj.children.length; i++) {
    this.handlePath(pathConfigObj.children[i], pathConfigObj)
  }
  return ret
}
