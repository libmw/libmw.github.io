---
  layout: post
  title: 如何建立github静态网站以及在本地搭建jekyll测试环境
---

# 如何建立github静态网站以及在本地搭建jekyll测试环境

## 方法一： 直接在某个项目里通过`gh-pages`分支创建这个项目的静态网站

* 每一个项目里都可以创建一个名为gh-pages的分支，`gh-pages`分支是一个特别的分支，独立于其他所有分支，它包含的是项目的静态网站的代码而不是项目代码。

* 这个分支可以通过github自带的github pages生成器自动创建，具体步骤为在项目主页右侧点击settings=》github pages，一步步生成即可。[官方文档](https://pages.github.com/)


## 方法二： 通过`username.github.io`项目创建静态网站

* 除了通过在项目里创建分支来创建静态网站，也可以直接创建一个名为`username.github.io`的项目(username是你的用户名)来存放静态网站。

* 只要我们把静态文件提交到此分支上，便可以通过 http://username.github.io 来访问我们的静态网站了


## 如何访问我们的静态网站

* 静态网站的域名为http://username.github.io，也可以自定义域名，[查看文档](https://help.github.com/articles/about-custom-domains-for-github-pages-sites/)

* 如果是方法一生成网站，我们可以通过http://username.github.io/项目名称 访问，如果是方法二生成的网站，我们通过http://username.github.io 直接访问。

## 如何编辑我们的网站

* 不管用何种方法生成网站，最终都仅仅是建立了一个可以存放静态文件且可以通过url访问到这些静态文件的github目录。如果要编辑我们的网站，只能通过手工编辑。

* 我们可以通过一些网站生成器生成静态网站，然后提交到网站目录，而github官方支持jekyll，我们可以把用jekyll标准书写的源代码提交到我们的目录，github会把他们自动编译成最终的静态网站。

### 创建jekyll静态网站

* jekyll官网： [http://jekyllrb.com/](http://jekyllrb.com/)

* 只要在github的静态网站项目里按照jekyll官方网站的格式建立我们的文件夹，书写我们的文件，然后再提交到github，github就可以自动把jekyll编译为静态网站：[查看例子](https://github.com/libmw/libmw.github.io)。本例
是在username.github.io项目里书写的jekyll，同理，我们也可以在某个项目的gh-pages分支里按照同样的格式来创建

* jekyll几个关键的文件和文件夹:
  * index.html: 网站首页

  * _layouts：模板布局页面

  * _posts: 文章页面，放置markdown格式的文章

### 搭建本地jekyll环境

1. 首先下载并安装[railsinstaller](http://railsinstaller.org/en)，安装好以后gem和ruby就都有了![](/resource/201502/1.png)

2. 然后执行 `gem install jekyll` 安装jekyll，注意有时候要执行多次才能成功![](/resource/201502/2.png)

3. 最后进入git项目的根目录，运行`jekyll serve` ，然后访问http://127.0.0.1:4000/便能看到效果了

4. 本地测试好以后，把代码提交到github，github会自动生成静态网站。注意jekyll生成的_site文件夹不需要提交，这个是本地的静态网站文件夹

> jekyll还有更多高级的用法，可以参考官方网站的[源代码](https://github.com/jekyll/jekyll/tree/master/site),里面包含了翻页，页面变量，页面数据等用法