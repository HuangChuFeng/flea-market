-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 2017-12-12 04:01:11
-- 服务器版本： 5.7.14
-- PHP Version: 5.6.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test`
--

-- --------------------------------------------------------

--
-- 表的结构 `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL COMMENT '关系序号',
  `userName` varchar(11) NOT NULL COMMENT '用户姓名',
  `contactsName` varchar(11) NOT NULL COMMENT '联系人姓名'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `contacts`
--

INSERT INTO `contacts` (`id`, `userName`, `contactsName`) VALUES
(1, '王那', 'NaNa'),
(2, '王那', '小抽'),
(3, 'NaNa', '小抽');

-- --------------------------------------------------------

--
-- 表的结构 `items`
--

CREATE TABLE `items` (
  `id` int(11) NOT NULL COMMENT '宝贝id',
  `title` varchar(50) NOT NULL COMMENT '名称',
  `type` varchar(11) NOT NULL COMMENT '类别',
  `price` int(11) NOT NULL COMMENT '价格',
  `imgPath` text NOT NULL COMMENT '图片路径',
  `description` text NOT NULL COMMENT '描述',
  `level` int(11) NOT NULL COMMENT '新旧程度',
  `status` int(1) NOT NULL DEFAULT '1' COMMENT '已售出（0）/在售（1）',
  `sellerId` int(11) NOT NULL COMMENT '卖家id',
  `hits` int(11) NOT NULL DEFAULT '0' COMMENT '浏览次数'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `items`
--

INSERT INTO `items` (`id`, `title`, `type`, `price`, `imgPath`, `description`, `level`, `status`, `sellerId`, `hits`) VALUES
(48, '你不知道的js', '书籍教材', 15, '../static/public/uploads/items/user20/你不知道的js/img0.jpg', '真的很有用的一本书，看完之后收获很大，学弟学妹们可以看看', 8, 0, 20, 21),
(54, '方形抱枕', '生活用品', 10, './static/public/uploads/items/user19/方形抱枕/img01512367676279.jpg', '配色很好看的抱枕', 6, 1, 19, 36),
(49, '台灯', '生活用品', 10, '../static/public/uploads/items/user21/台灯/img0.jpg', '很持久的台灯，充一次可以用好久，款式也很好看', 7, 0, 21, 19),
(42, '小书桌', '生活用品', 10, '/static/public/uploads/items/user19/小书桌/img01512363237533.jpg', '木质书桌，很方便', 6, 1, 19, 14),
(43, '全身镜', '生活用品', 10, './static/public/uploads/items/user19/全身镜/img0.jpg&./static/public/uploads/items/user19/全身镜/img1.jpg', '一直贴墙上啊，跟全新的一样其实', 8, 1, 19, 12),
(63, '安卓充电器', '生活用品', 10, '../static/public/uploads/items/user21/安卓充电器/img01512612892246.jpg&../static/public/uploads/items/user21/安卓充电器/img11512612892256.jpg', '快速充电头，数据线齐全', 6, 1, 21, 12),
(62, '蓝月亮洗衣液', '生活用品', 8, './static/public/uploads/items/user22/蓝月亮洗衣液/img01512528557604.jpg', '用了一半', 9, 1, 22, 23),
(65, '自行车', '交通工具', 200, '../static/public/uploads/items/user22/自行车/img01512710217151.jpg', '很实用啊，又环保', 5, 0, 22, 7),
(66, '闹钟', '生活用品', 10, '../static/public/uploads/items/user25/闹钟/img01513042582424.jpg', '功能完好', 8, 1, 25, 0),
(67, '多芬洗面奶', '化妆洗护', 15, '../static/public/uploads/items/user25/多芬洗面奶/img01513042659097.jpg', '用了三分之一', 9, 1, 25, 1),
(68, '代步车', '交通工具', 300, '../static/public/uploads/items/user23/代步车/img01513042815001.jpg', '大四快毕业了，急需下家', 8, 1, 23, 0),
(69, '仲夏夜之梦', '书籍教材', 10, '../static/public/uploads/items/user23/仲夏夜之梦/img01513042881859.jpg', '很好的一本英语读物', 9, 1, 23, 0),
(70, '手提帆布包', '衣物', 15, '../static/public/uploads/items/user24/手提帆布包/img01513042970500.jpg', '没怎么用过，还很新，已经洗干净了', 7, 1, 24, 0),
(71, '篮球', '体育用品', 50, '../static/public/uploads/items/user24/篮球/img01513043032852.jpg', '我们女生寝室买来玩的，也没怎么打过', 6, 1, 24, 0);

-- --------------------------------------------------------

--
-- 表的结构 `message`
--

CREATE TABLE `message` (
  `id` int(11) NOT NULL COMMENT '序号',
  `fromName` varchar(12) NOT NULL COMMENT '发送者姓名',
  `toName` varchar(12) NOT NULL COMMENT '接收者姓名',
  `content` text NOT NULL COMMENT '消息内容',
  `type` int(8) NOT NULL DEFAULT '0' COMMENT '消息类型（0 为文字，1为文件）',
  `status` int(8) NOT NULL DEFAULT '1' COMMENT '状态（0未读，1已读）',
  `createdTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建事件',
  `belong` int(12) NOT NULL COMMENT '确认该消息是属于哪条联系人关系的'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `message`
--

INSERT INTO `message` (`id`, `fromName`, `toName`, `content`, `type`, `status`, `createdTime`, `belong`) VALUES
(1, '小抽', '王那', '王那，我是小抽\n', 0, 1, '2017-12-01 06:34:49', 2),
(2, '王那', '小抽', '小抽，我是王那\n', 0, 1, '2017-12-01 06:35:38', 2),
(3, '王那', 'NaNa', '你好\n', 0, 1, '2017-12-01 06:42:17', 1),
(4, 'NaNa', '王那', '你好\n', 0, 1, '2017-12-01 06:42:58', 1),
(5, '小抽', '王那', 'hey\n', 0, 1, '2017-12-01 07:07:48', 2),
(6, '王那', '小抽', 'hai\n', 0, 1, '2017-12-01 07:08:04', 2),
(7, '王那', 'NaNa', '啦啦啦啦啦\n', 0, 1, '2017-12-01 07:08:17', 1),
(8, 'NaNa', '王那', '金佛大家\n', 0, 1, '2017-12-01 07:08:28', 1),
(9, 'NaNa', '王那', '你好\n', 0, 1, '2017-12-01 10:41:09', 1),
(10, '王那', 'NaNa', 'hey\n', 0, 1, '2017-12-01 10:42:05', 1),
(11, 'NaNa', '王那', '啦啦啦\n', 0, 1, '2017-12-01 10:42:20', 1),
(12, '王那', '小抽', '你好\n', 0, 1, '2017-12-01 11:43:48', 2),
(13, '王那', '小抽', '在吗\n', 0, 1, '2017-12-01 11:59:21', 2),
(14, 'NaNa', '王那', '在吗王那\n', 0, 1, '2017-12-01 12:00:03', 1),
(15, 'NaNa', '王那', '在吗在吗\n', 0, 1, '2017-12-01 12:00:38', 1),
(16, '王那', '小抽', '新消息\n', 0, 1, '2017-12-01 12:06:59', 2),
(17, 'NaNa', '王那', '新消息\n', 0, 1, '2017-12-01 12:07:23', 1),
(21, 'NaNa', '小抽', '在吗，我是王那\n', 0, 1, '2017-12-02 01:15:23', 3),
(22, 'NaNa', '小抽', '哈哈哈，这是离线消息\n', 0, 1, '2017-12-02 01:16:16', 3),
(23, 'NaNa', '小抽', '你好\n', 0, 1, '2017-12-02 05:24:10', 3),
(25, '王那', '小抽', '这是未读消息\n', 0, 1, '2017-12-02 06:50:33', 2),
(26, '王那', '小抽', '再来未读消息\n', 0, 1, '2017-12-02 06:52:33', 2),
(27, '王那', '小抽', 'hey\n', 0, 1, '2017-12-02 06:58:54', 2),
(28, '王那', '小抽', '(｡･∀･)ﾉﾞ嗨\n', 0, 1, '2017-12-02 07:03:20', 2),
(29, '王那', '小抽', '啦啦啦啦啦\n', 0, 1, '2017-12-02 07:05:04', 2),
(30, '王那', '小抽', '哈哈哈哈哈哈哈哈哈哈哈\n', 0, 1, '2017-12-02 07:13:15', 2),
(31, '王那', '小抽', '最后一次\n', 0, 1, '2017-12-02 07:14:49', 2),
(32, '王那', '小抽', '真的是最后一次\n', 0, 1, '2017-12-02 07:19:12', 2),
(33, '王那', '小抽', '合影\n', 0, 1, '2017-12-02 07:22:08', 2),
(34, '小抽', '王那', '那么久\n', 0, 1, '2017-12-02 07:24:27', 2),
(35, '王那', '小抽', '是的', 0, 1, '2017-12-02 07:33:51', 2),
(36, '王那', '小抽', '真的最后一次\n', 0, 1, '2017-12-02 07:37:03', 2),
(37, 'NaNa', '小抽', '来自nana的离线消息\n', 0, 1, '2017-12-02 07:38:12', 3),
(38, 'NaNa', '小抽', '我是nana\n', 0, 1, '2017-12-02 07:41:03', 3),
(39, 'NaNa', '小抽', '数据库\n', 0, 1, '2017-12-02 07:42:58', 3),
(40, '小抽', 'NaNa', '更新了的\n', 0, 1, '2017-12-02 07:44:33', 3),
(41, 'NaNa', '小抽', 'hey\n', 0, 1, '2017-12-02 08:01:41', 3),
(42, '小抽', '王那', '底部\n', 0, 1, '2017-12-02 08:03:15', 2),
(43, '小抽', '王那', '底部来了\n', 0, 1, '2017-12-02 08:04:18', 2),
(44, '小抽', '王那', '呵呵呵\n', 0, 1, '2017-12-02 08:05:12', 2),
(45, '小抽', 'NaNa', '总的来说\n', 0, 1, '2017-12-02 08:07:44', 3),
(46, '小抽', '王那', '哈哈哈\n', 0, 1, '2017-12-02 08:09:04', 2),
(47, '王那', '小抽', '终于好了\n', 0, 1, '2017-12-02 08:09:16', 2),
(48, '王那', '小抽', '终于一直在底部了\n', 0, 1, '2017-12-02 08:09:21', 2),
(49, '王那', '小抽', '可以休息了\n', 0, 1, '2017-12-02 08:09:25', 2),
(50, '王那', '小抽', '吃东西去啦！！！！！！\n', 0, 1, '2017-12-02 08:09:33', 2),
(51, '王那', 'NaNa', '幸苦了\n', 0, 1, '2017-12-02 14:10:15', 1),
(52, '小抽', 'NaNa', '好累\n', 0, 1, '2017-12-02 14:30:03', 3),
(53, '小抽', 'NaNa', '累死了\n', 0, 1, '2017-12-02 14:30:49', 3),
(54, '小抽', 'NaNa', '自作孽\n', 0, 1, '2017-12-02 14:32:55', 3),
(55, '王那', '小抽', '', 0, 1, '2017-12-02 14:47:32', 2),
(56, '王那', '小抽', '', 0, 1, '2017-12-02 14:47:45', 2),
(57, '小抽', '王那', '干嘛啊\n', 0, 1, '2017-12-04 06:28:47', 2),
(58, '小抽', '王那', '又干嘛啊\n', 0, 1, '2017-12-04 06:31:39', 2),
(59, '小抽', '王那', '怎么了\n', 0, 1, '2017-12-04 06:35:10', 2),
(60, '小抽', '王那', '又怎么了\n', 0, 1, '2017-12-04 06:41:56', 2),
(61, 'NaNa', '王那', '', 0, 1, '2017-12-07 02:19:54', 1),
(62, '小抽', '王那', '测试未读消息\n', 0, 1, '2017-12-07 03:02:35', 2),
(63, '王那', 'NaNa', '我在家\n', 0, 1, '2017-12-07 03:04:06', 1),
(64, '王那', 'NaNa', '你在哪儿\n', 0, 1, '2017-12-07 05:44:01', 1),
(65, '王那', 'NaNa', '../static/public/chatRecord/1512629959288.jpg', 1, 1, '2017-12-07 06:59:19', 1),
(66, 'NaNa', '王那', '../static/public/chatRecord/1512630566788.jpg', 1, 1, '2017-12-07 07:09:26', 1),
(67, 'NaNa', '王那', '好看吗\n', 0, 1, '2017-12-07 07:11:29', 1),
(68, 'NaNa', '王那', '\n', 0, 1, '2017-12-07 07:17:01', 1),
(69, 'NaNa', '王那', '../static/public/chatRecord/1512631239916.jpg', 1, 1, '2017-12-07 07:20:39', 1),
(70, '王那', 'NaNa', '../static/public/chatRecord/1512631309276.jpg', 1, 1, '2017-12-07 07:21:49', 1),
(71, '王那', 'NaNa', '哈哈\n', 0, 1, '2017-12-07 07:41:47', 1),
(72, '王那', 'NaNa', '测试超过一天\n', 0, 1, '2017-12-09 06:44:38', 1),
(73, '王那', '小抽', 'fjifjsdoa\n', 0, 1, '2017-12-11 03:55:09', 2),
(74, '王那', 'NaNa', 'hey\n', 0, 1, '2017-12-11 03:55:26', 1),
(75, '王那', 'NaNa', 'ha\n', 0, 1, '2017-12-11 03:56:16', 1);

-- --------------------------------------------------------

--
-- 表的结构 `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL COMMENT '订单id',
  `itemId` int(11) NOT NULL COMMENT '宝贝Id',
  `sellerId` int(11) NOT NULL COMMENT '卖家id',
  `buyerId` int(11) NOT NULL COMMENT '买家Id',
  `status` int(11) DEFAULT '0' COMMENT '订单状态（0未付款，1等待卖家确认，2交易成功）',
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '交易时间'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `orders`
--

INSERT INTO `orders` (`id`, `itemId`, `sellerId`, `buyerId`, `status`, `time`) VALUES
(5, 63, 21, 20, 1, '2017-12-07 02:15:58'),
(9, 62, 22, 19, 0, '2017-12-11 04:29:13'),
(3, 48, 20, 21, 2, '2017-12-06 03:27:39'),
(4, 49, 21, 19, 2, '2017-12-06 11:22:00'),
(6, 43, 19, 22, 0, '2017-12-08 14:02:54'),
(8, 65, 22, 19, 2, '2017-12-11 03:51:01'),
(10, 62, 22, 19, 0, '2017-12-11 04:39:40'),
(11, 54, 19, 23, 1, '2017-12-12 02:09:12');

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL COMMENT '用户ID',
  `userName` varchar(12) NOT NULL COMMENT '用户名',
  `pwd` varchar(225) NOT NULL COMMENT '密码',
  `email` varchar(25) NOT NULL COMMENT 'email',
  `imgPath` tinytext COMMENT '用户头像路径',
  `collect` tinytext COMMENT '收藏宝贝id的数组',
  `account` varchar(20) DEFAULT NULL COMMENT '支付帐号'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `user`
--

INSERT INTO `user` (`id`, `userName`, `pwd`, `email`, `imgPath`, `collect`, `account`) VALUES
(21, '小抽', '$2a$10$Wj6XyKsNkdrzbmFXebhpO.gyuyMJykCpoPZs1CO1zMzIjvMNJ/WQ2', '111@qq.com', NULL, '54&43', '13429875828'),
(20, 'NaNa', '$2a$10$7CnxneeuV9jLQApcNDE72.5kDFtemWscffFk.BznKSgxQZLY6haT2', 'vvv@qq.com', NULL, NULL, NULL),
(19, '王那', '$2a$10$zPGvplw5EVagbAc3ln5WW.ZPzW4vdvahtGfu/s/1fOH3/4EzziFX2', 'sss@qq.com', '../static/public/uploads/portrait/user19_21.jpg', '46&48', NULL),
(22, '邮件测试帐号', '$2a$10$Lwmy0tbpMwToCFUrximWVe8xsExf9Lyk9/14lRGbYddibZtTQZsFa', 'hcf_server@sina.com', NULL, NULL, NULL),
(23, '小明', '$2a$10$EsoSLXOPE3O.PZ7azS92DOqFYhuoswm2aCKJHjlxpkDd/4j.2elKm', 'xiaoming@qq.com', NULL, '54', NULL),
(24, '李欣', '$2a$10$EsoSLXOPE3O.PZ7azS92DOwyATH7OIRortNSEs9FHMlEGlhNokaL6', 'lixin@qq.com', NULL, NULL, NULL),
(25, '张梦', '$2a$10$EsoSLXOPE3O.PZ7azS92DOnB0Jm.PsNjmwHGT28DUol6YVod36UDm', 'zhangmeng@qq.com', NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '关系序号', AUTO_INCREMENT=4;
--
-- 使用表AUTO_INCREMENT `items`
--
ALTER TABLE `items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '宝贝id', AUTO_INCREMENT=72;
--
-- 使用表AUTO_INCREMENT `message`
--
ALTER TABLE `message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '序号', AUTO_INCREMENT=76;
--
-- 使用表AUTO_INCREMENT `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '订单id', AUTO_INCREMENT=12;
--
-- 使用表AUTO_INCREMENT `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID', AUTO_INCREMENT=26;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
