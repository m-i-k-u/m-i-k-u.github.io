(function() {
    var a = [].slice; !
        function() {
            var e, n, t, o, r, d, l, g, s, i, c, m, u, b, f, h, p, v, D, M, A, I, x, y, Y, k, q, w, F, V, j, z, B, C, E, G, H, J;
            for (y = $("body").find("div.calendar:eq(0)"), u = new Date, C = 37621 * u.getFullYear() + 539 * (u.getMonth() + 1) + u.getDate(), A = [
                {name: "看AV", good: "释放压力，重铸自我", bad: "会被家人撞到"},
                {name: "组模型", good: "今天的喷漆会很完美", bad: "精神不集中板件被剪断了"},
                {name: "投稿情感区", good: "问题圆满解决", bad: "会被当事人发现"},
                {name: "逛贴吧", good: "今天也要兵库北", bad: "看到丧尸在晒妹"},
                {name: "和女神聊天", good: "女神好感度上升", bad: "我去洗澡了，呵呵"},
                {name: "啪啪啪", good: "啪啪啪啪啪啪啪", bad: "会卡在里面"},
                {name: "熬夜", good: "夜间的效率更高", bad: "明天有很重要的事"},
                {name: "锻炼", good: "八分钟给你比利般的身材", bad: "会拉伤肌肉"},
                {name: "散步", good: "遇到妹子主动搭讪", bad: "走路会踩到水坑"},
                {name: "打排位赛", good: "遇到大腿上分500", bad: "我方三人挂机"},
                {name: "汇报工作", good: "被夸奖工作认真", bad: "上班偷玩游戏被扣工资"},
                {name: "抚摸猫咪", good: "才不是特意蹭你的呢", bad: "死开！愚蠢的人类"},
                {name: "遛狗", good: "遇见女神遛狗搭讪", bad: "狗狗随地大小便被罚款"},
                {name: "烹饪", good: "黑暗料理界就由我来打败", bad: "难道这就是……仰望星空派？"},
                {name: "告白", good: "其实我也喜欢你好久了", bad: "对不起，你是一个好人"},
                {name: "求站内信", good: "最新种子入手", bad: "收到有码葫芦娃"},
                {name: "追新番", good: "完结之前我绝不会死", bad: "会被剧透"},
                {name: "打卡日常", good: "怒回首页", bad: "会被老板发现"},
                {name: "下副本", good: "配合默契一次通过", bad: "会被灭到散团"},
                {name: "抢沙发", good: "沙发入手弹无虚发", bad: "会被挂起来羞耻play"},
                {name: "网购", good: "商品大减价", bad: "问题产品需要退换"},
                {name: "跳槽", good: "新工作待遇大幅提升", bad: "再忍一忍就加薪了"},
                {name: "读书", good: "知识就是力量", bad: "注意力完全无法集中"},
                {name: "早睡", good: "早睡早起方能养生", bad: "会在半夜醒来，然后失眠"},
                {name: "逛街", good: "物美价廉大优惠", bad: "会遇到奸商"}
            ], g = function() {
                for (j = [], D = 1; 50 >= D; D++) j.push(D);
                return j
            }.apply(this), H = "甲乙丙丁戊己庚辛壬癸", b = "子丑寅卯辰巳午未申酉戌亥", q = "一二三四五六七八九十", Y = "正二三四五六七八九十冬腊", J = "日一二三四五六", G = "鼠牛虎兔龙蛇马羊猴鸡狗猪", m = null, c = null, i = null, d = null, e = [2635, 333387, 1701, 1748, 267701, 694, 2391, 133423, 1175, 396438, 3402, 3749, 331177, 1453, 694, 201326, 2350, 465197, 3221, 3402, 400202, 2901, 1386, 267611, 605, 2349, 137515, 2709, 464533, 1738, 2901, 330421, 1242, 2651, 199255, 1323, 529706, 3733, 1706, 398762, 2741, 1206, 267438, 2647, 1318, 204070, 3477, 461653, 1386, 2413, 330077, 1197, 2637, 268877, 3365, 531109, 2900, 2922, 398042, 2395, 1179, 267415, 2635, 661067, 1701, 1748, 398772, 2742, 2391, 330031, 1175, 1611, 200010, 3749, 527717, 1452, 2742, 332397, 2350, 3222, 268949, 3402, 3493, 133973, 1386, 464219, 605, 2349, 334123, 2709, 2890, 267946, 2773, 592565, 1210, 2651, 395863, 1323, 2707, 265877], x = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334], n = function(a, e) {
                return a >> e & 1
            },
                     f = function() {
                         var t, o, r, l, g, s, u, b, f, h;
                         for (u = 1 <= arguments.length ? a.call(arguments, 0) : [], d = 3 !== u.length ? new Date: new Date(u[0], u[1], u[2]), h = null, l = null, g = null, o = null, t = !1, f = d.getYear(), 1900 > f && (f += 1900), h = 365 * (f - 1921) + Math.floor((f - 1921) / 4) + x[d.getMonth()] + d.getDate() - 38, d.getYear() % 4 === 0 && d.getMonth() > 1 && h++, l = r = 0; 255 > r; l = ++r) {
                             for (o = e[l] < 4095 ? 11 : 12, g = s = b = o; s >= 0; g = s += -1) {
                                 if (h <= 29 + n(e[l], g)) {
                                     t = !0;
                                     break
                                 }
                                 h = h - 29 - n(e[l], g)
                             }
                             if (t) break
                         }
                         return m = 1921 + l,
                             c = o - g + 1,
                             i = h,
                             12 === o && (c === Math.floor(e[l] / 65536) + 1 && (c = 1 - c), c > Math.floor(e[l] / 65536) + 1) ? c--:void 0
                     },
                     r = function() {
                         var a;
                         return a = "",
                             a += H.charAt((m - 4) % 10),
                             a += b.charAt((m - 4) % 12),
                             a += "",
                             a += G.charAt((m - 4) % 12),
                             a += "年 ",
                             1 > c ? (a += "闰", a += Y.charAt( - c - 1)) : a += Y.charAt(c - 1),
                             a += "月",
                             a += 11 > i ? "初": 20 > i ? "十": 30 > i ? "廿": "三十",
                         (i % 10 !== 0 || 10 === i) && (a += q.charAt((i - 1) % 10)),
                             a
                     },
                     o = function(a, e, n) {
                         return 1921 > a || a > 2020 ? "": (e = parseInt(e) > 0 ? e - 1 : 11, f(a, e, n), r())
                     },
                     t = function() {
                         return u.getFullYear() + "年" + (1 + u.getMonth()) + "月" + u.getDate() + "日 星期" + ["日", "一", "二", "三", "四", "五", "六"][u.getDay()]
                     },
                     z = function(a, e) {
                         var n, t, o, r;
                         for (o = a % 11117, n = t = 0, r = 25 + e; r >= 0 ? r > t: t > r; n = r >= 0 ? ++t: --t) o *= o,
                             o %= 11117;
                         return o
                     },
                     $("#item-date-calendar").text(t()), $("#item-subdate-calendar").text(o(u.getFullYear(), 1 + u.getMonth(), u.getDate())), E = z(C, 8) % 100, B = z(C, 4) % 100, p = "", v = M = 0, F = z(C, 9) % 3 + 2; F >= 0 ? F > M: M > F; v = F >= 0 ? ++M: --M) k = parseInt(.01 * E * A.length, 10),
                l = A[k],
                I = parseInt(z(C, 3 + v) % 100 * .01 * g.length, 10),
                p += '<li><p class="a">' + l.name + '</p><p class="b">' + l.good + '</p><span class="clearfix"></span></li>',
                A.splice(k, 1),
                g.splice(I, 1);
            for ($("#good").find("ul").eq(0).html(p), p = "", v = w = 0, V = z(C, 7) % 3 + 2; V >= 0 ? V > w: w > V; v = V >= 0 ? ++w: --w) k = parseInt(.01 * B * A.length, 10),
                l = A[k],
                I = parseInt(z(C, 2 + v) % 100 * .01 * g.length, 10),
                p += '<li><p class="a">' + l.name + '</p><p class="b">' + l.bad + '</p><span class="clearfix"></span></li>',
                A.splice(k, 1),
                g.splice(I, 1);
            return $("#bad").find("ul").eq(0).html(p),
                (h = function() {
                    var a;
                    return k = z(C * new Date().getDate(), 6) % 100,
                        a = function() {
                            return 5 > k ? "大凶": 20 > k ? "凶": 50 > k ? "末吉": 60 > k ? "半吉": 70 > k ? "吉": 80 > k ? "小吉": 90 > k ? "中吉": "大吉"
                        },
                        $("#item-sign-calendar").text(a).css({
                            color: "rgb(" + (10 + .8 * k) + "%, 20%, 20%)"
                        }).attr({
                            title: "今日运势指数：" + k + "%"
                        })
                })()
        } ()
}).call(this);