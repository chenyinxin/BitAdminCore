SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SysUser](
	[userId] [uniqueidentifier] NOT NULL,
	[departmentId] [uniqueidentifier] NULL,
	[userCode] [nvarchar](32) NULL,
	[userName] [nvarchar](32) NULL,
	[userPassword] [nvarchar](128) NULL,
	[idCard] [nvarchar](32) NULL,
	[mobile] [nvarchar](32) NULL,
	[email] [nvarchar](128) NULL,
	[post] [nvarchar](32) NULL,
	[gender] [nvarchar](32) NULL,
	[birthday] [datetime] NULL,
	[extendId] [nvarchar](64) NULL,
	[userStatus] [nvarchar](32) NULL,
	[orderNo] [int] NULL,
	[createBy] [uniqueidentifier] NULL,
	[createTime] [datetime] NULL,
	[updateBy] [uniqueidentifier] NULL,
	[updateTime] [datetime] NULL,
 CONSTRAINT [PK_SysUser] PRIMARY KEY CLUSTERED 
(
	[userId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
