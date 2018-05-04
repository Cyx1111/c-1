@Code
    ViewData("Title") = "关于"
End Code

<hgroup class="title">
    <h1>@ViewData("Title").</h1>
    <h2>@ViewData("Message")</h2>
</hgroup>

<article>
    <p>
        使用此区域可提供附加信息。
    </p>

    <p>
        使用此区域可提供附加信息。
    </p>

    <p>
        使用此区域可提供附加信息。
    </p>
</article>

<aside>
    <h3>副标题</h3>
    <p>
        使用此区域可提供附加信息。
    </p>
    <ul>
        <li>@Html.ActionLink("主页", "Index", "Home")</li>
        <li>@Html.ActionLink("关于", "About", "Home")</li>
        <li>@Html.ActionLink("联系方式", "Contact", "Home")</li>
    </ul>
</aside>