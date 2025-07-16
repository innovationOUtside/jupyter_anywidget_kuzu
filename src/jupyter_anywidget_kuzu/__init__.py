import importlib.metadata
import pathlib
from IPython.display import display
import anywidget
import traitlets

try:
    __version__ = importlib.metadata.version("jupyter_anywidget_kuzu")
except importlib.metadata.PackageNotFoundError:
    __version__ = "unknown"


class Widget(anywidget.AnyWidget):
    _esm = pathlib.Path(__file__).parent / "static" / "widget.js"
    _css = pathlib.Path(__file__).parent / "static" / "widget.css"
    value = traitlets.Int(0).tag(sync=True)


class kuzuWidget(anywidget.AnyWidget):
    _esm = pathlib.Path(__file__).parent / "static" / "kuzu.js"
    _css = pathlib.Path(__file__).parent / "static" / "kuzu.css"
    value = traitlets.Int(0).tag(sync=True)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        display("initialised")
        print("initialised2")


def kuzu_inline( **kwargs):
    widget_ = kuzuWidget(**kwargs)
    display(widget_)
    return widget_
