const defaultOptions = {
    selector: '#canvas-drag'
};

function CanvasDrag(options = {}) {
    options = {
        ...defaultOptions,
        ...options,
    };

    const pages = getCurrentPages();
    const ctx = pages[pages.length - 1];

  const canvasDrag = ctx.selectComponent(options.selector);
    delete options.selector;

  return canvasDrag;
}

CanvasDrag.export = () => {
  const canvasDrag = CanvasDrag();
  if (!canvasDrag) {
        console.error('请设置组件的id="canvas-drag"!!!');
    } else {
    return CanvasDrag().export();
    }
};

CanvasDrag.initByArr = (arr) => {
    const canvasDrag = CanvasDrag();
    if (!canvasDrag) {
        console.error('请设置组件的id="canvas-drag"!!!');
    } else {
        return CanvasDrag().initByArr(arr);
    }
};

CanvasDrag.initByTreeArr = (arr) => {
  const canvasDrag = CanvasDrag();
  if (!canvasDrag) {
    console.error('请设置组件的id="canvas-drag"!!!');
  } else {
    return CanvasDrag().initByTreeArr(arr);
  }
};

CanvasDrag.exportJson = () => {
    const canvasDrag = CanvasDrag();
    if (!canvasDrag) {
        console.error('请设置组件的id="canvas-drag"!!!');
    } else {
        return CanvasDrag().exportJson();
    }
};

CanvasDrag.changFontColor = (color) => {
    const canvasDrag = CanvasDrag();
    if (!canvasDrag) {
        console.error('请设置组件的id="canvas-drag"!!!');
    } else {
        return CanvasDrag().changColor(color);
    }
};

CanvasDrag.changeBgColor = (color) => {
    const canvasDrag = CanvasDrag();
    if (!canvasDrag) {
        console.error('请设置组件的id="canvas-drag"!!!');
    } else {
        return CanvasDrag().changeBgColor(color);
    }
};

CanvasDrag.changeBgImage = (bgImage) => {
    const canvasDrag = CanvasDrag();
    if (!canvasDrag) {
        console.error('请设置组件的id="canvas-drag"!!!');
    } else {
        return CanvasDrag().changeBgImage(bgImage);
    }
};

CanvasDrag.clearCanvas = () => {
  const canvasDrag = CanvasDrag();
  if (!canvasDrag) {
    console.error('请设置组件的id="canvas-drag"!!!');
  } else {
    return CanvasDrag().clearCanvas();
  }
};

// 增加了这个
CanvasDrag.initByTree = (tree) => {
  const canvasDrag = CanvasDrag();
  if (!canvasDrag) {
    console.error('请设置组件的id="canvas-drag"!!!');
  } else {
    return CanvasDrag().initByTree(tree);
  }
};

CanvasDrag.enableZoom = (trueOrfalse) => {
  const canvasDrag = CanvasDrag();
  if (!canvasDrag) {
    console.error('请设置组件的id="canvas-drag"!!!');
  } else {
    return CanvasDrag().enableZoom(trueOrfalse);
  }
};

CanvasDrag.enableDel = (trueOrfalse) => {
  const canvasDrag = CanvasDrag();
  if (!canvasDrag) {
    console.error('请设置组件的id="canvas-drag"!!!');
  } else {
    return CanvasDrag().enableDel(trueOrfalse);
  }
};

CanvasDrag.enableAdd = (trueOrfalse) => {
  const canvasDrag = CanvasDrag();
  if (!canvasDrag) {
    console.error('请设置组件的id="canvas-drag"!!!');
  } else {
    return CanvasDrag().enableAdd(trueOrfalse);
  }
};

CanvasDrag.onAddNode = () => {
  const canvasDrag = CanvasDrag();
  if (!canvasDrag) {
    console.error('请设置组件的id="canvas-drag"!!!');
  } else {
    return CanvasDrag().addNewNode();
  }
};

CanvasDrag.onDelNode = () => {
  const canvasDrag = CanvasDrag();
  if (!canvasDrag) {
    console.error('请设置组件的id="canvas-drag"!!!');
  } else {
    return CanvasDrag().delNode();
  }
};

CanvasDrag.onDoDel = () => {
  const canvasDrag = CanvasDrag();
  if (!canvasDrag) {
    console.error('请设置组件的id="canvas-drag"!!!');
  } else {
    return CanvasDrag().onDoDel();
  }
};

CanvasDrag.changeNodeInfo = (newInfo) => {
  const canvasDrag = CanvasDrag();
  if (!canvasDrag) {
    console.error('请设置组件的id="canvas-drag"!!!');
  } else {
    return CanvasDrag().changeNodeInfo(newInfo);
  }
};

CanvasDrag.getTaskByIndex = (index) => {
  const canvasDrag = CanvasDrag();
  if (!canvasDrag) {
    console.error('请设置组件的id="canvas-drag"!!!');
  } else {
    return CanvasDrag().getTaskByIndex(index);
  }
};

export default CanvasDrag;