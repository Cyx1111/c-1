@Code
    Layout = "~/_SiteLayout.vbhtml"
    PageData("Title") = "主页"
End Code

@Section featured
    <section class="featured">
        <div class="content-wrapper">
            <hgroup class="title">
                <h1>@PageData("Title").</h1>
                <h2>
                    Modify this template to jump-start your ASP.NET Web Pages application.</h2>
            </hgroup>
            <p>
                To learn more about ASP.NET Web Pages, visit
                <a href="http://asp.net/webpages" title="ASP.NET Web Pages Website">http://asp.net/webpages</a>.
                The page features <mark>videos, tutorials, and samples</mark> to help you get the most from ASP.NET Web Pages.
                If you have any questions about ASP.NET Web Pages, visit
                <a href="http://forums.iis.net/1166.aspx" title="ASP.NET Web Pages Forum">our forums</a>.
            </p>
        </div>
    </section>
End Section

<h3>下面是我们的建议:</h3>

<ol class="round">
    <li class="one">
        <h5>开始使用</h5>
        ASP.NET Web Pages 和新的 Razor 语法提供了一种便捷、友好的轻型方式，用于将服务器代码与 HTML 结合
        以创建动态 Web 内容。可用于连接到数据库、添加视频、链接到社交网络站点，
        并包括许多用于使用最新 Web 标准创建美丽站点的功能。
        <a href="http://go.microsoft.com/fwlink/?LinkId=245139">了解详细信息...</a>
    </li>

    <li class="two">
        <h5>添加 NuGet 程序包并快速开始编码</h5>
        通过 NuGet，可以轻松地安装和更新免费的库和工具。
        <a href="http://go.microsoft.com/fwlink/?LinkId=245140">了解详细信息...</a>
    </li>

    <li class="three">
        <h5>查找 Web 宿主</h5>
        可以轻松找到所提供的功能和价格都适合你应用程序的 Web 宿主公司。
        <a href="http://go.microsoft.com/fwlink/?LinkId=245143">了解详细信息...</a>
    </li>
</ol>
