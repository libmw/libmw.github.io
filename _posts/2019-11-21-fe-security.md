---
  layout: post
  title: web开发过程中需要了解的安全知识
---

# web开发过程中需要了解的安全知识

![security](/resource/2019/security.jpg)


&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;作为一个web开发人员，当谈及安全的时候，我们一般会想到这些名词：`XSS漏洞`、`SQL注入`、`CSRF`等，然而web的安全远远不止这些常见的漏洞，下面就来列举一下在开发应用的时候需要考虑的各种安全问题。


## HTTP传输的安全

![logo](/resource/2019/https-enabled.jpg)


http请求都是明文传送，一旦传输过程经过了一个非法的中间商，中间商就能够截取传输的内容。

如果我们把用户的密码通过http明文传输，用户的密码很容易被泄露。我们发送给用户的内容也有可能被运营商篡改，加上广告等，影响我们的用户体验。

为了防止我们的传输被中间商篡改，我们需要通过`https协议`来对传输内容进行加密传输。

下面我们就来看看HTTPS如何实现加密传输。

### `对称加密`和`非对称加密`

对称加密简单来说就是密码本加密，如1对应A，2对应B，需要传输"AB"的时候实际传输的是"12"，没有密码本的人是没办法理解"12"解密后的内容的。对称加密的优点就是简单，加密解密效率非常高。对称加密的缺陷就是密码本一旦被盗取则加密失效。

非对称加密没有密码本的概念，它使用`公钥(加密钥)`和一个`私钥(解密钥匙)`，`公钥`是公开的，任何人都可以使用公钥对内容进行加密，但是加密后的内容只能被`私钥`解密。由于`私钥`掌握在解密方手中，不会在公网上传输，很难被窃取，因此非对称加密是比较安全的。但是非对称加密也有一个很大的缺点，就是效率比较低，只适合用来传输少量的数据。

因此，在HTTPS的实现过程中，客户端先从服务器取得`公钥`，然后通过`非对称加密`，使用公钥把`对称加密`的秘钥加密后传给服务器，服务器通过自己的`私钥`解开这个`对称加密秘钥`，然后后面的请求都通过对称加密进行，这样安全地传输了密码本，也得到了极快的加密效率。

当然实际的加密过程会更复杂一些，如需要引入数字证书确保公钥不被篡改，详细的HTTPS传输流程参考下图：

![https流程](/resource/2019/https_process.png)

### HTTP Strict-Transport-Security

为了强制浏览器只能通过https访问我们的应用，可以使用`Strict-Transport-Security`头。

`Strict-Transport-Security`头用法如下：

Strict-Transport-Security: max-age=<expire-time>; includeSubDomains; preload

告诉浏览器以后只能使用HTTPS访问本网站，只要max-age不过期。

includeSubDomains; preload都是可选性，告诉是否需要子域名生效和是否需要preload请求生效。

## cookie的安全


![cookies](/resource/2019/remove-cookies-in-web-browsers.jpg)

由于http是无状态的协议，为了保持会话，我们通常会把会话信息存储到浏览器中，而存储方式就是`cookie`。

`cookie`代表了用户的身份，是极其私密的数据，它的安全性如果得不到保证，用户的信息就很可能被盗取，身份也会被冒充。

那么`cookie`有哪些隐患需要我们去注意呢？

一旦我们的浏览器被恶意脚本控制，恶意脚本就能够读取cookie并传输到恶意服务器后台，导致用户身份被盗取。

+ 通过配置`httponly`防止javascript访问到`cookie`。

> 一旦为cookie配置了httponly属性，就算页面含有xss，恶意脚本也无法读取到cookie，保证了cookie的安全。

+ 配置`Secure`保证网站被劫持后无法获取cookie。

> 具有Secure的cookie只能被https请求发送。这样就算被中间商劫持了网站也无法取得cookie。

+ 配置`SameSite`防止跨站提交携带cookie。

> 跨站提交是非常常见的攻击方式，但是我们可以为cookie指定SameSite属性，使得跨站提交的时候不会携带cookie，这样即使有跨站提交漏洞，由于无法携带cookie，也就很难利用漏洞了。

最后，即使对cookie进行了正确的设置，老的浏览器也有可能不支持这些安全设置。因此最好还是要通过`token验证`来保证不受跨站攻击的风险。

## 业务的安全

### 防止密码被暴力破解

如果我们的登录接口没有做暴力破解限制，攻击者就可以对单一的用户名穷举其密码。理论上来说，只要有足够的时间这个密码是肯定可以被穷举到的。因此我们在做登录验证的时候需要通过`加验证码`、`限制同一用户24小时内的登录次数`来防止密码被暴力破解。

### 防止验证码被穷举

我们在很多业务中，如忘记密码时都会给用户发送一条手机验证码短信，用户填入正确的验证码后方可执行后面的流程。

然而如果我们不做穷举预防，攻击者就可以反复调用接口穷举所有的验证码，直到成功为止。

为了预防验证码被穷举，我们可以`限制验证码试错的次数`，一旦次数达到阈值则需要重新发送验证码，减少验证码被穷举的可能性。

### 防止ssrf攻击

![ssrf](/resource/2019/ssrf.jpg)


ssrf全称`Server-Side Request Forgery`，即服务端请求伪造。

想象这样的场景：某应用提供了一个api调试器，用户填入api地址，点击提交后由服务器去访问这个api地址并把响应内容返回给用户。

如果服务端没做校验，攻击者可以填入一个内网地址，利用当前服务器做跳板访问集群上的任意服务器，导致安全漏洞。

为了防止ssrf漏洞，我们在提供代理服务的时候需要对被代理的url进行严格的安全验证，防止代理到不安全的url上。

## 防止恶意文件的上传

如果我们的网站是用php开发的，在某个文件上传接口中允许用户上传php文件，那么攻击者就可以上传一个恶意的php文件，并通过url访问这个文件在服务器中的地址从而执行这个文件，实现对服务器的控制。

因此我们文件上传的接口一定要对文件的类型进行判定，且用户上传的文件和我们应用的可执行文件不要放在同一个执行环境中，防止恶意上传文件漏洞。

## 用户输入的安全和CSP

![content-security-policy](/resource/2019/content-security-policy.png)

CSP全称Content Security Policy，即`内容安全策略`。是一套比较完善的保护页面的策略。它可以指定哪些资源是可以被加载和执行的，一旦没在内容安全策略里包含的资源，都会被浏览器忽略掉。

通过CSP，我们可以配置`内联脚本不被执行`、`eval不被执行`、`非https加载的脚本不被执行`、`非指定域名的媒体不被加载`等。

通过`CSP`的配置，我们可以防止被`XSS`攻击后的页面被攻击者利用。

通过内容安全策略，不在安全策略内的javascript无法执行，css无法执行，音乐和视频媒体不会被播放，图片不会被加载或者上传。

例如我们要阻止eval脚本的执行，可以设置：

content-security-policy: default-src 'none'; script-src 'unsafe-inline';

这样内联脚本是可以执行的，但是eval里的脚本是无法执行的。

我们甚至可以限制某段内联脚本的sha256必须为某个值才能执行：

`Content-Security-Policy: script-src 'sha256-B2yPHKaXnvFWtRChIbabYmUBFZdVfKKXHbWtWidDVF8='`

这样只有内联js的sha256等于这个值才能执行，即下面这段脚本：

&lt;script>var inline = 1;&lt;/script&gt;

## CORB

![CORB](/resource/2019/CORB.jpg)

CORB全称Cross-origin read blocking，即：跨域读取拦截。CORB的意思是，在一个网页中尝试跨域加载某些类型的资源时，如果这些资源满足CORB阻止的条件，那么浏览器不会下载这些资源。

CORB会拦截跨域请求json、html 或者 xml资源。换句话说，跨域请求这些content-type的资源是不允许的，要想资源被跨域请求，就不能设置content-type为这些类型。


之所以会有CORB，是因为在页面中跨站加载任意资源，会造成敏感数据被强制加载到内存中，攻击者有可能通过一些很奇特的方式拿到内存中的东西而进行攻击。比如`幽灵和熔断漏洞`(利用cpu的`预执行`策略，进行`旁路攻击`)。

chrome触发CORB流程为：

+ 如果 response 包含 X-Content-Type-Options: nosniff 响应头部，那么如果 Content-Type 是以下几种的话,response 将受 CORB 保护：
    + html mime type
    + xml mime type（除了 image/svg+xml）
    + json mime type
    + text/plain
+ 如果 response 的状态是 206，那么如果 Content-Type 是以下几种的话， response 将受 CORB 保护：
    + html mime type
    + xml mime type（除了 image/svg+xml）
    + json mime type
+ 否则，CORB 将尝试探测 response 的 body：
    + html mime type，并且探测结果是 html 内容格式，response 受 CORB 保护
    + xml mime type（除了 image/svg+xml）, 并且探测结果是 xml 内容格式，response 受 CORB 保护
    + json mime type，并且探测结果是 json 内容格式，response 受 CORB 保护
    + text/plain，并且探测结果是 json、html 或者 xml 内容格式，response 受 CORB 保护
    + 任何以 JSON security prefix 开头的 response（除了 text/css）受 CORB 保护

受保护就是`被拦截掉`的意思。

> 可以看到，其实`大多数情况会进入第三个分支`。那么在第三个分支上浏览器为啥一定要扫描？这是为了防拦截了那些依赖被`错误标记`的跨源响应的页面（比如，图片资源但是格式却被标记为 text/html）。如果不进行格式探测，那么会有16倍以上的 response 被拦截。

> 因为有了CORB的策略，我们在一些跨域业务上应该联系业务为我们的资源设置正确的http头。如对于JSONP，我们应该设置content-type为`text/javascript`，这样可以保证我们的文件不会被CORB。

> 因为大多数服务器的安全员会设置`X-Content-Type-Options: nosniff`头部，因此我们要为我们需要`跨域的资源设置正确`的`content-type`以免被阻止掉。

一个触发CORB的例子:

+ 在http://127.0.0.1:4000/引入&lt;img src="http://127.0.0.1/static/index.css" /&gt;

+ nginx中配置css文件的content-type为`text/plain`，且`add_header X-Content-Type-Options 'nosniff'`;

此时浏览器报错
> Cross-Origin Read Blocking (CORB) blocked cross-origin response http://127.0.0.1/static/index.css with MIME type text/plain



总结：本文我们介绍了web开发中需要注意的一些典型安全问题，并给出了具体的解决方案。通过这些方案对web应用加固后我们的系统将会变得更加安全。但是仅仅做这些还不够，我们需要在业务开发的过程中时刻保持警惕，对核心业务的安全性进行定期的复盘，只有这样才能让我们的系统变得更加的稳固，让我们的客户能够放心使用。