-- use 'database库名';

drop table if exists bookmark_bookmark;
CREATE TABLE `bookmark_bookmark` (
  `id` varchar(256) COLLATE utf8mb4_general_ci NOT NULL,
  `web_name` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `web_url` varchar(1024) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `icon_url` text COLLATE utf8mb4_general_ci,
  `folder_status` tinyint(1) DEFAULT NULL,
  `parent_id` varchar(256) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sort_number` int DEFAULT NULL,
  `user_id` varchar(256) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `web_desc` varchar(1024) COLLATE utf8mb4_general_ci DEFAULT NULL DEFAULT '',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT ' 创建时间 ',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
  `delete_status` tinyint(1) NOT NULL DEFAULT 0,
  `md5_status` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_parent_id` (`parent_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

drop table if exists bookmark_user_config;
create table bookmark_user_config(
  id bigint(20) PRIMARY key AUTO_INCREMENT ,
	user_id varchar(256) not null comment '用户id',
	config_type int not null default 1 comment '设置类型 1-时钟,2-秒钟，3-首页, 4-时钟进制',
	config_value varchar(256) default '' comment '配置value',
	config_status tinyint(1) not null  default 1 comment '是否启用 1-启用 0-关闭',
	delete_status tinyint(1) not null  default 0 comment '是否启用 0-不删除 1-删除',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT ' 创建时间 ',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
	  KEY `idx_user_id` (`user_id`) USING BTREE
  )ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE = utf8mb4_general_ci;
-- 1. 用户设置密码， 2、服务端加密入库， 3、输入密码，给服务端验证密码正确性， 4、成功前端解密、服务端


drop table if exists bookmark_webicon;
create table bookmark_webicon(
  id bigint(20) PRIMARY key AUTO_INCREMENT ,
	web_url varchar(256) default '' comment '网址',
	icon_url varchar(256) default '' comment '网址图标',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
	  KEY `idx_web_url` (`web_url`) USING BTREE
  )ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE = utf8mb4_general_ci;

  CREATE TABLE `sys_permission` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(32) NOT NULL COMMENT ' 权限名称 ',
  `code` varchar(32) NOT NULL COMMENT ' 按钮code ',
  `auth_code` varchar(32) NOT NULL COMMENT ' 权限code ',
  `path` varchar(32) NOT NULL COMMENT ' 菜单url ',
  `type` tinyint(1) NOT NULL COMMENT ' 类型 1-目录，2-菜单，3-按钮 ',
  `icon` varchar(256) NOT NULL DEFAULT '' COMMENT ' 菜单图标 ',
  `sort` int(11) NOT NULL DEFAULT '0' COMMENT ' 排序 ',
  `parent_id` bigint(20) DEFAULT NULL COMMENT ' 上级菜单id ',
  `level` tinyint(1) NOT NULL DEFAULT '0' COMMENT ' 菜单级别0-最上级菜单 1-',  
  `enable_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT ' 是否启用 0-未启用，1-启用 ',
  `delete_status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0-未删除，1-删除 ',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT ' 创建时间 ',
  `create_user_no` varchar(32) NOT NULL COMMENT ' 创建者账号 ',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT ' 修改时间 ',
  `update_user_no` varchar(32) NOT NULL COMMENT ' 修改者账号 ',
  PRIMARY KEY (`id`),
  KEY `idx_title` (`title`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT=' 权限表 ';

	-- 用户输入密码  前端公私钥加密带时间戳  服务端解密判断时间戳在1s之内就算解密成功  服务端md5加密拿到md5比较数据库

user_base_info();
user_three_info();
user_login_log();

base64_config(
id 
base64_md5
data_value text
url 
)
