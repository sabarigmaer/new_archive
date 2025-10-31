import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function toFourDigits(num: number) {
  return String(num).padStart(4, "0");
}

async function main() {
  // 1. Insert the gallery
  // const gallery = await prisma.gallery.create({
  //   data: {
  //     title: "Neha Sharma",
  //     description:
  //       "Custom collection",
  //     coverImage:
  //       "https://images.news18.com/ibnlive/uploads/2022/06/neha-sharma-2.jpg",
  //     parentId: null,
  //   },
  // });

  const base =
    "https://cosplaythots.com/images/a/1280/-10000001/10011366/"

  //   const links = [
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/1_bafkreieza2fgo2tyw64vs52xdgyl5uoqfkb5izzsaxnkcfwm6jy2ux7elu.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/2_bafkreiaxy6f2zzuw5puosutc5cekokt7bl6akoxoklouhidsfse7xskevm.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/3_bafkreiggmz2kh7n35ohikvogn5ueugslvwfu2di3k75jz7pkykymo3hcd4.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/4_bafkreicmnn5cuzpgm6leoitm6v3d5fk37veok53i2wsuqt4q54da22kq5u.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/5_bafkreig3wmkfcwtpewfpqlcbwyifloicqiieljxiota6j5nijlihimwv5y.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/6_bafkreig4qdx6462ms2dkdtqc6bsawofqja67gmj6gf32md35wxax4b7k4a.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/7_bafkreihlpn7pcgbxi2zxjcki7hzhc72rcarsle25t4pnm7sxi5sm4xt6di.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/8_bafkreibagl4ufq3cpvjiileter6ebtjq2azmr3vapcjrwitds5uo2iwcum.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/9_bafkreic3udb6rcm42jwkveehih76wbljmvin5jjilapy3cfy45imabg5hu.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/10_bafkreia5bxuml7h3vxlz3nhfq6jj7ecvfthbsbkeifzwstnjtz2ab5kdwq.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/11_bafkreiegyy6dopkfevcyeo3zpsm2luzl5xfyy2gzreudxzl6fhj6mqqrim.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/12_bafkreid6pwzzkkn32r6inpnagbftdnizs7suo5cy6tiktlzgnkqsspiqym.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/13_bafkreiauoo62wv3f4rxzoreuqpzmrtlrqhhi7xl3vmvjpd3vbq62xsma3a.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/14_bafkreiaqscvldlfdvmjxxx52ql7643a75rlhykcnv5fqgaszxir3wplzwu.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/15_bafkreifbltnvmtalbg7ziliwqm43ootaypan3qs4kjgv6ysxlzljwjxqzu.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/16_bafkreieaquogilmyywugnu6fku4nil3i3w7qn3wq2lwpunpm5kysvwywgq.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/17_bafkreiayqdq2iytyapukt257eha62dijxrnfumw6ahxbbt3gkk72gmg7ue.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/18_bafkreih46hyymlzl363aqk3a7ufjulehdwphubrdicgcjtkae4v7knsfbm.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/19_bafkreihkpbntfcuqvd62l42yi7kafmmfccusq74k55f5hi5ocobbw2v6p4.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/20_bafkreiea6cszsao6hp4alrmz2s5apys6bkga4j3klrjell2aymjqbj6bzy.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/21_bafkreidagbozfowwtjjz5xtkjtmbb2wfwpdijexwri2kf4trybp4huvmkm.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/22_bafkreiei4sogmovr42r5zlzijzepul5npvc23wccldbblqoctrzpmyo4sm.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/23_bafkreibl7cfzqheb2jfrnwgyt5ik3d6fphsteys52uxz2chcojih3ptlym.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/24_bafkreifpgyf3wmu7zwpcbpcnsnm2y7e7zz5m7vpv562litm5sf7auuyh7u.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/25_bafkreifcwjyknppxv7sasryjvgeiant74memgewaldyw5esnqhbvq756v4.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/26_bafkreigdqh7kh674vegblk4bik3vqq3tl47qhdepuiowbjgct6gy5aw2ma.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/27_bafkreib2vpbpfu7rzoaxmydnn7bxg3wmmwcwgvx7ilgqborr4vxpq5hrtq.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/28_bafkreibwy5zldcsgbcj4sshugdnabj2ccvfirr7nzhmw763qsiwhqatgvi.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/29_bafkreigdbjk4qjsjkjsb7ljl3eicgpopnjc56b2uqr2tgi4ybrtt5qivbe.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/30_bafkreiglhub7mguouchkxvsdbi5ojd4f6tnjgligiwzzzcovsxeka7tpl4.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/31_bafkreidkc3yiico5utkfc4eedkbaowynvupenqtbaysnusffna6d4z5q5y.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/32_bafkreiaahc6k7iynivfdl4vqlc4g65mkmnimfo7zkujkc6px62eayo3fbi.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/33_bafkreicrgj6ousn6dn4dgu3dmbx3tipcgtoy22px3rriizbr673lbi5jdq.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/34_bafkreihg6kpth2jgccs4w7hyeneuzmrgyainv6oovhbj6h4nyktt4siyii.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/35_bafkreiafe66kzaboyhmp6et3qhr4ekvz6lq2hn5ljsyxglyrrudo5bspiu.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/36_bafkreif2ajyuqpfmjjz6xmspruuww4iq76egknjrxtz7w5qrb4tqg3hqji.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/37_bafkreiguz2a4p4mthmqk5l6t5s7mbttj5k5hjslv4q7ttayl262kf7x5we.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/38_bafkreig67f5dgdn64rjkthgjnl7u7k2lsk6js6wisqoczpsuisw6yztzhm.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/39_bafkreic73baq4ypnouum6mngwjdh7xdmxbr63ul3whjctliayyclkpkb2y.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/40_bafkreighby3kqdnteztjbl5mbfro4kyt2uvbep6eflzdhe5sr6wyigsn5a.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/41_bafkreidxsjbwwzhls2foaylyvp7zj3ivihuzjt4m7rzugzxtdo3j2gsgo4.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/42_bafkreih7ixncetu2gcnrf7aerlorbhefijehns4z2jr2s6yve4pgzxqhlm.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/43_bafkreicth72rs7kfb6rv72htmyw2kub5pocmxhexexdfh4mwflkmvgtkwq.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/44_bafkreid4mvna5mppwexyuxxvs525nexttfn5gsetjhe6nx3zspcx7xstoq.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/45_bafkreigon3tghw4f22cwm4p6sxzfjcg6h5wlxauc7dmdpmwjvcyzuhtvpq.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/46_bafkreib4uqdgahszvggwqlrfloopiwpv5onhvhi3qc3gvtvdwyrmqmsp6i.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/47_bafkreicxcw737uf4kz3subdkitflnis2icyh4pd6bsfounbyg4q2qgthfq.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/48_bafkreieq56omsmmkf4atoe6c25hnsw2arucurdeecrspf6ow7oo6m2ducq.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/49_bafkreifgd2v2uphwawotkoxqcdgn43vos23eq2tzstetsx56ra3c7oqlpa.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/50_bafkreign3bkpdpqm4ogfy7q46jz37bzat6svrdpalhxctk7qmou4slrymy.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/51_bafkreielvzr3myewklfcw5esmzbo4vcysfalsulx2eulf3zdm4e2bybzti.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/52_bafkreida7wtgey3hgpbldx6uy3mqwqtsawlwrxscnfs6ps23jft4mlek3q.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/53_bafkreihpyokc4zmp2fxggj2lrwa2b6o3cdwucqsehcasnxazzko34ypk5i.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/54_bafkreihb25wj2kg5jubym54qucccnwx45fjzk253j2l6d2srguzyqf34hy.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/55_bafkreiccxlvsrbyn7v3pr4h2y4mvfb2lck3minf774rxd4mpnm2ufwlqv4.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/56_bafkreid5bfrqayly7dwd3totdlwfqx2aag37rzg7ld4lil4lwx6fqeagg4.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/57_bafkreidqfi66gtloqhjwrsxhgdsqcro7upqm4lzxfb6fclvufnohqxkhia.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/58_bafkreic6sroyxzc4wnadcisladnjd5oscmgejz6cgffgc3qdjiz57t7ulu.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/59_bafkreicsfp3vps6rapf6be3lve3mpfk6n3xefxmyukeuzprulwhypfjzi4.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/60_bafkreiam4j4lx3xasmkxkvwnrwan55b57dfi5tdwnggfle25ngyekrzb6e.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/61_bafkreigzd6f325vnrpkm3fwonmx3imywt5ykh5h2jbh6d7q7jxbyo3ct5e.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/62_bafkreiet7bioe5rprorwuwbbmou5cuczv6wywxervpsui4baxbxt54q7vq.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/63_bafkreief2vio3gfsmllub7x6x6aausxytbz2tienz77jrndholgkkymebu.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/64_bafkreibwya3vu7djlplozfioiu4tmc6putid2ljnu5xa4gi7htutstsa74.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/65_bafkreihripsjlria5nmzawjgnbg7hs7fx3ox5jt6nd3wto6zzoicnerccm.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/66_bafkreig7ky5xx6jamlej4recgrbsadpjnql2j77vds6wltufcdltfkkq4i.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/67_bafkreie2ygrwrliohkucaybdwhma7kgkcf576jcqu2it3pywjlmfd546q4.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/68_bafkreigk27qjyegms4652a7v3i2j34uqmzfoxac7w5ntrhpk2vcy4rfh4a.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/69_bafkreic4x57auvoklveowwu3lanr2ueb7ccsj6z6ts73hsrq3q5tmtdxl4.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/70_bafkreicpom7quu76n5dyr4ppblang6bgagnqbq2emaltrxn36oi2kh4i3i.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/71_bafkreia3r3yyywr3grjypknnpc6uovvyybvajahxakv3dameahrmpouafy.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/72_bafkreicsd46cvpvgbeyawbbcqr6ch4lmyizjerj6wlfd2l5kzwda366dja.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/73_bafkreiaf2uu2ysd3fg2qzoxi3ozyno6hz7rddvbs7w6qgc5pwpe4zjudku.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/74_bafkreihf4vcdjap5hcffesx5mg6ykn4maiuhdgsevnz5ovaxz4xs5weki4.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/75_bafkreignp7f2mcqglwayzp3wc5gukep66pobinjcdqcmsjfgtxyt5jwurq.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/76_bafkreifwqifz4vvxcdmoqmhgzhedtvhr74xqjobsb7j4zdqfpqrug4sbwm.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/77_bafkreifigmedcp6v5jjs74wcgyozbt33ktwou4v444vjvwxu3rhwkul2p4.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/78_bafkreiee4ev3d7qisey3gkyycb5qs54chglomddgnm2b4j6blkgsl4ibdm.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/79_bafkreifggr2qwnrhhezi4y6cn4blq34kyzifhtqgy33i7rnecpmkxjwggi.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/80_bafkreianjfrszdv4tk46hv4butkyhvv3ahwtknra6ormf3hgaheybv46g4.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/81_bafkreibdwwmujkjqyswxgjd7vqootiovemgtqo34ryuup4nvlt3ts7vcjq.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/82_bafkreih7ytnpx5rvgdiddl477wqotccfeoxfku4yrdsqndb33lqjyrukdi.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/83_bafkreidnbs2zexxehiddzp5rvltj6azjaottcuolybzivfesuusgt5rcfy.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/84_bafkreigddxwoth6jt44yyoxw3w7cz2e5s4i3zwitwgqyrzaz3of57flkyi.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/85_bafkreig72743vzebhffsdf3fflzpg5cwqgbl2d6564opjp5nesjsvekpuq.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/86_bafkreide35rd6vipyt457s22jlqp6xojrg26viif6vthfph6kf3wetog3e.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/87_bafkreigdndhdmn5jk2t3svxe5ts64px7iudqn54ihbzejqddxxwpvdpvvu.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/88_bafkreic6g4tq7i7psehq2nsu3zgepe7kcxc4t7tt5kbgpsxudg6ykcae5a.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/89_bafkreibakrdo4hnac6mxvz37z4pdz4zgn2sniu6b6a7bszygyangvhnifa.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/90_bafkreibzkprueij32sxba4omstklscfodj4eiql6wpprufed26mfye3ndm.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/91_bafkreighc7be6klyu2i7rb7jpuunszhntvrfif5dqpbg4ogsqzu2b2pedq.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/92_bafkreiehpbba6fbkaftrgi346u4n27hlwdkgygu7657s3l3hngjolq4j5e.png",
  //   "https://eraofmeat.com/ipfs/bafybeibllsrsiadferqlphdgqi2hbu52vb2nxwviahnvfqivhfrpauafae/content/93_bafkreicy5k5ojlgq3njw4dvp5y5upldpt5drubqalisalxmrxmp5kqlwn4.png"
  // ]

  const links = [];

  for (let i = 1; i <= 123; i++) {
    // const newi = String(toFourDigits(i))
    // const link = base + (Number(newi[0]) + 1)+ '000'+'/zoedalby_' +newi + '.jpg'
    // links.push(link)
    links.push(base + i + ".webp");
  }

  //   // 2. All 67 links

  // 3. Insert all files
  await prisma.file.createMany({
    data: links.map((url) => ({
      name: url.split("/").pop() || "unknown",
      url,
      galleryId: 688,
    })),
  });

  console.log(
    // `✅ Inserted gallery "${gallery.title}" with ${links.length} files`,
    // gallery.id
  );
}

// async function main() {
//   const gallery = await prisma.gallery.create({
//     data: {
//       title: 'Era of Meat',
//       description: 'link: https://kemono.cr/patreon/user/20908878, alt: meat_master',
//       coverImage: 'https://img.kemono.cr/thumbnail/data/28/34/28347eda0f9d1921207e1accea7c5e5ea1e0442c9147af583293bdcace2cdfcd.jpg'
//     }
//   })
//   console.log(gallery)
// }
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
