USE [master]
GO
/****** Object:  Database [tis_history]    Script Date: 12.03.2022 21:47:07 ******/
CREATE DATABASE [tis_history] ON  PRIMARY 
( NAME = N'tis_history', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL10_50.MSSQLSERVER\MSSQL\DATA\tis_history.mdf' , SIZE = 3072KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'tis_history_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL10_50.MSSQLSERVER\MSSQL\DATA\tis_history_log.ldf' , SIZE = 1024KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [tis_history] SET COMPATIBILITY_LEVEL = 100
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [tis_history].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [tis_history] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [tis_history] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [tis_history] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [tis_history] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [tis_history] SET ARITHABORT OFF 
GO
ALTER DATABASE [tis_history] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [tis_history] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [tis_history] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [tis_history] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [tis_history] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [tis_history] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [tis_history] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [tis_history] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [tis_history] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [tis_history] SET  DISABLE_BROKER 
GO
ALTER DATABASE [tis_history] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [tis_history] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [tis_history] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [tis_history] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [tis_history] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [tis_history] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [tis_history] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [tis_history] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [tis_history] SET  MULTI_USER 
GO
ALTER DATABASE [tis_history] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [tis_history] SET DB_CHAINING OFF 
GO
EXEC sys.sp_db_vardecimal_storage_format N'tis_history', N'ON'
GO
USE [tis_history]
GO
/****** Object:  Table [dbo].[Agregates]    Script Date: 12.03.2022 21:47:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Agregates](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[AgregateName] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_Agregates] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[HeatDetails]    Script Date: 12.03.2022 21:47:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[HeatDetails](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[HeatId] [bigint] NOT NULL,
	[ParamId] [int] NOT NULL,
	[ParamValue] [nvarchar](255) NULL,
 CONSTRAINT [PK_HeatDetails] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[HeatParams]    Script Date: 12.03.2022 21:47:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[HeatParams](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ParamName] [nvarchar](255) NOT NULL,
 CONSTRAINT [PK_HeatParams] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Heats]    Script Date: 12.03.2022 21:47:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Heats](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[AgregateId] [int] NOT NULL,
	[HeatId] [nvarchar](10) NOT NULL,
	[StartPoint] [datetime] NOT NULL,
	[EndPoint] [datetime] NULL,
	[SteelGrade] [nvarchar](255) NULL,
 CONSTRAINT [PK_Heats] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  UserDefinedFunction [dbo].[SplitString]    Script Date: 12.03.2022 21:47:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[SplitString]
(
  @List     nvarchar(max),
  @Delim    nvarchar(50)
)
RETURNS TABLE
AS
  RETURN ( 
	SELECT [RESULT] 
	FROM ( 
		SELECT [RESULT] = LTRIM(RTRIM(SUBSTRING(@List, [Number], CHARINDEX(@Delim, @List + @Delim, [Number]) - [Number])))
		FROM (
			SELECT Number = ROW_NUMBER() OVER (ORDER BY name)
			FROM sys.all_columns
		) AS x 
		WHERE Number <= LEN(@List) AND SUBSTRING(@Delim + @List, [Number], DATALENGTH(@Delim)/2) = @Delim
	) AS y
  );
GO
SET IDENTITY_INSERT [dbo].[Agregates] ON 

INSERT [dbo].[Agregates] ([Id], [AgregateName]) VALUES (1, N'AKOS')
INSERT [dbo].[Agregates] ([Id], [AgregateName]) VALUES (2, N'DSP')
INSERT [dbo].[Agregates] ([Id], [AgregateName]) VALUES (3, N'CCM1')
SET IDENTITY_INSERT [dbo].[Agregates] OFF
SET IDENTITY_INSERT [dbo].[HeatDetails] ON 

INSERT [dbo].[HeatDetails] ([Id], [HeatId], [ParamId], [ParamValue]) VALUES (21, 24, 4, N'18:54:00')
SET IDENTITY_INSERT [dbo].[HeatDetails] OFF
SET IDENTITY_INSERT [dbo].[HeatParams] ON 

INSERT [dbo].[HeatParams] ([Id], [ParamName]) VALUES (1, N'ENERGY_INPUT')
INSERT [dbo].[HeatParams] ([Id], [ParamName]) VALUES (2, N'FILL_POINT')
INSERT [dbo].[HeatParams] ([Id], [ParamName]) VALUES (4, N'FLUSH_POINT')
SET IDENTITY_INSERT [dbo].[HeatParams] OFF
SET IDENTITY_INSERT [dbo].[Heats] ON 

INSERT [dbo].[Heats] ([Id], [AgregateId], [HeatId], [StartPoint], [EndPoint], [SteelGrade]) VALUES (24, 2, N'192154', CAST(N'2022-03-12T18:42:05.773' AS DateTime), CAST(N'2022-03-12T20:53:16.863' AS DateTime), N'Ст.3сп')
INSERT [dbo].[Heats] ([Id], [AgregateId], [HeatId], [StartPoint], [EndPoint], [SteelGrade]) VALUES (27, 2, N'192155', CAST(N'2022-03-12T20:15:05.453' AS DateTime), NULL, N'Ст.3сп')
INSERT [dbo].[Heats] ([Id], [AgregateId], [HeatId], [StartPoint], [EndPoint], [SteelGrade]) VALUES (28, 1, N'192154', CAST(N'2022-03-12T20:53:34.213' AS DateTime), NULL, N'Ст.0')
SET IDENTITY_INSERT [dbo].[Heats] OFF
ALTER TABLE [dbo].[HeatDetails]  WITH CHECK ADD  CONSTRAINT [FK_HeatDetails_HeatParams] FOREIGN KEY([ParamId])
REFERENCES [dbo].[HeatParams] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[HeatDetails] CHECK CONSTRAINT [FK_HeatDetails_HeatParams]
GO
ALTER TABLE [dbo].[HeatDetails]  WITH CHECK ADD  CONSTRAINT [FK_HeatDetails_Heats1] FOREIGN KEY([HeatId])
REFERENCES [dbo].[Heats] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[HeatDetails] CHECK CONSTRAINT [FK_HeatDetails_Heats1]
GO
ALTER TABLE [dbo].[Heats]  WITH CHECK ADD  CONSTRAINT [FK_Heats_Agregates] FOREIGN KEY([AgregateId])
REFERENCES [dbo].[Agregates] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Heats] CHECK CONSTRAINT [FK_Heats_Agregates]
GO
/****** Object:  StoredProcedure [dbo].[sp_AddHeatDetails]    Script Date: 12.03.2022 21:47:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Grigoriy Dolgiy
-- Create date: 2022-03-12
-- Description:	Updates heat details with values
-- Usage: exec sp_AddHeatDetails '112444', 'dsp', 'FILL_POINT=20220302%2014:30:01|FLUSH_POINT=20220302%2019:10:21';
-- =============================================
CREATE PROCEDURE [dbo].[sp_AddHeatDetails]
	@heatId nvarchar(10),
	@agregate nvarchar(50),
	@details nvarchar(max)	-- string like <param1=value1|param2=value2...>
AS
BEGIN
	
	SET NOCOUNT ON;

    
	BEGIN TRY

		exec sp_CheckAgregate @agregate;	-- check if agregate exists
		exec sp_CheckHeat @heatId;			-- check if heat exists

		DECLARE @chunk nvarchar(max);		-- outer pairs of [param=value]
		DECLARE @ParamsToAdd table (		-- table with result values to update
			Par nvarchar(255),
			Val nvarchar(255)
		);

		-- splitting details by pairs then by values and fill @ParamsToAdd table
		DECLARE CHUNK_CURSOR CURSOR LOCAL STATIC READ_ONLY FORWARD_ONLY
		FOR SELECT * FROM SplitString(@details,'|');
	
		OPEN CHUNK_CURSOR;
		FETCH NEXT FROM CHUNK_CURSOR INTO @chunk;
		WHILE @@FETCH_STATUS = 0
		BEGIN

			-- splitting pairs by values
			DECLARE PAIR_CURSOR CURSOR LOCAL STATIC READ_ONLY FORWARD_ONLY
			FOR SELECT * FROM SplitString(@chunk,'=');

			DECLARE @ParamName nvarchar(255);	-- inner param name from pair
			DECLARE @ParamValue nvarchar(255);	-- inner param value from pair

			OPEN PAIR_CURSOR;
			FETCH NEXT FROM PAIR_CURSOR INTO @ParamName;
			FETCH NEXT FROM PAIR_CURSOR INTO @ParamValue;
			CLOSE PAIR_CURSOR;
			DEALLOCATE PAIR_CURSOR;

			-- check if param exists in param dictionary
			exec sp_CheckParam @ParamName;

			INSERT INTO @ParamsToAdd SELECT @ParamName,@ParamValue;

			FETCH NEXT FROM CHUNK_CURSOR INTO @chunk;
		END;
		CLOSE CHUNK_CURSOR;
		DEALLOCATE CHUNK_CURSOR;
		-- now we got @ParamsToAdd table ready to merge

		DECLARE @agregateId int;
		SET @agregateId = (SELECT Id FROM Agregates WHERE AgregateName = @agregate)

		DECLARE @heatUniqueId nvarchar(10);
		SET @heatUniqueId = (SELECT Id FROM Heats WHERE HeatId = @heatId);

		-- first delete all the existing params
		DELETE FROM HeatDetails 
		WHERE 
			ParamId IN ( SELECT hp.Id FROM HeatParams hp
						 JOIN @ParamsToAdd pa ON hp.ParamName = pa.Par ) 
			AND HeatId = @heatUniqueId;

		-- now insert new values
		INSERT INTO HeatDetails (HeatId, ParamId, ParamValue)
		SELECT 
			@heatUniqueId
			,(SELECT Id FROM HeatParams WHERE ParamName = Par)
			,Val 
		FROM @ParamsToAdd;

	END TRY
	BEGIN CATCH
		DECLARE @msg nvarchar(max);
		SELECT @msg = ERROR_MESSAGE();
		RAISERROR(@msg,16,1);
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[sp_CheckAgregate]    Script Date: 12.03.2022 21:47:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Grigoriy Dolgiy
-- Create date: 2022-03-13
-- Description:	Checks if given agregate exists
-- =============================================
CREATE PROCEDURE [dbo].[sp_CheckAgregate] 
	@agregate nvarchar(50)
AS
BEGIN
	SET NOCOUNT ON;

    IF NOT EXISTS (SELECT * FROM Agregates WHERE AgregateName = @agregate)
	BEGIN
		DECLARE @msg nvarchar(max);
		SELECT @msg = 'No such agregate "' + @agregate + '"';
		RAISERROR(@msg, 16, 1);
	END;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_CheckHeat]    Script Date: 12.03.2022 21:47:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Grigoriy Dolgiy
-- Create date: 2022-03-13
-- Description:	Checks if given heat exists
-- =============================================
CREATE PROCEDURE [dbo].[sp_CheckHeat] 
	@heat nvarchar(50)
AS
BEGIN
	SET NOCOUNT ON;

    IF NOT EXISTS (SELECT * FROM Heats WHERE HeatId = @heat)
	BEGIN
		DECLARE @msg nvarchar(max);
		SELECT @msg = 'No such heat "' + @heat + '"';
		RAISERROR(@msg, 16, 1);
	END;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_CheckParam]    Script Date: 12.03.2022 21:47:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Grigoriy Dolgiy
-- Create date: 2022-03-13
-- Description:	Checks if given param exists
-- =============================================
CREATE PROCEDURE [dbo].[sp_CheckParam]
	@param nvarchar(50)
AS
BEGIN
	SET NOCOUNT ON;

    IF NOT EXISTS (SELECT * FROM HeatParams WHERE ParamName = @param)
	BEGIN
		DECLARE @msg nvarchar(max);
		SELECT @msg = 'No such param "' + @param + '"';
		RAISERROR(@msg, 16, 1);
	END;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_CloseHeat]    Script Date: 12.03.2022 21:47:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Grigoriy Dolgiy
-- Create date: 2022-03-10
-- Description:	Opens a heat
-- Usage: exec sp_CloseHeat 'dsp'
-- =============================================
CREATE PROCEDURE [dbo].[sp_CloseHeat] 
	@heatId nvarchar(10)
AS
BEGIN
	SET NOCOUNT ON;

	exec sp_CheckHeat @heatId;

    UPDATE Heats SET EndPoint = GETDATE() WHERE HeatId = @heatId;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_OpenHeat]    Script Date: 12.03.2022 21:47:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Grigoriy Dolgiy
-- Create date: 2022-03-10
-- Description:	Opens a heat
-- Usage: exec sp_OpenHeat 'dsp', '112444', 'C355'
-- =============================================
CREATE PROCEDURE [dbo].[sp_OpenHeat] 
	@agregate nvarchar(50),
	@heatId nvarchar(10),
	@steelGrade nvarchar(255)
AS
BEGIN
	SET NOCOUNT ON;
	

	BEGIN TRY
		INSERT INTO Heats (StartPoint, AgregateId, HeatId, SteelGrade)
		SELECT GETDATE(), a.Id, @heatId, @steelGrade
		FROM Agregates a WHERE a.AgregateName = @agregate;

		SELECT SCOPE_IDENTITY();
	END TRY
	BEGIN CATCH
		DECLARE @msg NVARCHAR(4000);
		SELECT @msg = ERROR_MESSAGE();
		RAISERROR(@msg,16,1);
	END CATCH;
END
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The agregates dictionary' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Agregates'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Heat parameters dictionary' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'HeatParams'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The agregate Id' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Heats', @level2type=N'COLUMN',@level2name=N'AgregateId'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Start DateTime point' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Heats', @level2type=N'COLUMN',@level2name=N'StartPoint'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'End DateTime point' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Heats', @level2type=N'COLUMN',@level2name=N'EndPoint'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Energy ON point' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Heats', @level2type=N'COLUMN',@level2name=N'SteelGrade'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The staple table contains agregates heat info' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Heats'
GO
USE [master]
GO
ALTER DATABASE [tis_history] SET  READ_WRITE 
GO
