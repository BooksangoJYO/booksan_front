<template>
<div class="col-md-3">
    <div class="card border-0">
        <div class="card-body">
            <nav class="nav flex-column">
                <router-link class="nav-link text-secondary" to="/mypage">프로필</router-link>
                <router-link class="nav-link text-secondary" to="/mypage/bookmarks">북마크</router-link>
                <router-link class="nav-link text-secondary" to="/mypage/bookmarkbooks">내가 북마크한 책</router-link>
                <router-link class="nav-link text-secondary" to="/mypage/myposts">내가 작성한 글</router-link>
            </nav>
        </div>
    </div>
</div>
</template>