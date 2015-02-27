---
  layout: post
  title: 如何建立github个人博客以及在本地搭建jekyll测试环境
---

# 如何建立github个人博客以及在本地搭建jekyll测试环境

* 建立个人博客可以使用github自带的工具，就想在博客网站上写博客一样，一步步生成即可 [官方文档](https://pages.github.com/)

* 不过这种方法显然是去了github的乐趣。所以一般都是通过领一种方式，也就是jekyll

## 搭建jekyll形式的github个人博客

> 首先是建立一个*.github.io的项目，这个[官方文档](https://pages.github.com/)里已经说得很清楚了(User or organization site),官方文档底部有一个Blogging with Jekyll的链接，里面也说了如何通过jekyll来建立个人网站，
，但是说得比较不清楚，通过亲身实践，总结了如何几个简单的步骤：

1. 首先下载并安装[railsinstaller](http://railsinstaller.org/en)，安装好以后gem和ruby就都有了![](/resource/201502/1.png)

2. 然后执行 `gem install jekyll` 安装jekyll，注意有时候要执行多次才能成功![](/resource/201502/2.png)

3. 最后进入git项目的根目录，运行`jekyll serve` ，然后访问http://127.0.0.1:4000/便能看到效果了

4. 本地测试好以后，把代码提交到github，github会自动生成静态网站。注意jekyll生成的_site文件夹不需要提交，这个是本地的静态网站文件夹