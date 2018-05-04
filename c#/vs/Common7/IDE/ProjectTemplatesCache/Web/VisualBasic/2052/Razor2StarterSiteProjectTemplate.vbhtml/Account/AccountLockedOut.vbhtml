﻿@Code
    Layout = "~/_SiteLayout.vbhtml"
    PageData("Title") = "帐户已锁定"
End Code

<hgroup class="title">
    <h1 class="error">@PageData("Title").</h1>
    <h2 class="error">你的帐户因无效登录尝试次数太多而被锁定。</h2>
</hgroup>

<p>
    不要担心，此帐户将在 60 秒内自动取消锁定。
    请在这段时间过后重试。
</p>