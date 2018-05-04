SET QUOTED_IDENTIFIER OFF 
GO
SET ANSI_NULLS ON 
GO

-- Sets DB recovery mode to simple
ALTER DATABASE [LoadTest] SET RECOVERY Simple
GO

use LoadTest
GO

ALTER TABLE [dbo].[LoadTestCase]
    ADD [TestElement] [image] NULL   
GO

ALTER TABLE [dbo].[LoadTestCase]
    ADD [TestType] [nvarchar] (64) COLLATE SQL_Latin1_General_CP1_CI_AS NULL    
GO

ALTER TABLE [dbo].[LoadTestMessage] 
    ADD [TestLogId] [int] NULL
GO

ALTER TABLE [dbo].[LoadTestTestDetail] 
    ADD [Outcome] [tinyint] NULL
GO

ALTER TABLE [dbo].[LoadTestTestDetail] 
    ADD [TestLogId] [int] NULL
GO

ALTER TABLE [dbo].[LoadTestTestDetail] 
    ADD [UserId] [int] NULL
GO

ALTER TABLE [dbo].[LoadTestTestDetail] 
    ADD [EndTime] [datetime] NULL
GO

ALTER TABLE [dbo].[LoadTestTestDetail] 
    ADD [InMeasurementInterval] [bit] NULL
GO

ALTER TABLE [dbo].[LoadTestPageDetail] 
    ADD [EndTime] [datetime] NULL
GO

ALTER TABLE [dbo].[LoadTestPageDetail] 
    ADD [Outcome] [tinyint] NULL
GO

ALTER TABLE [dbo].[LoadTestPageDetail] 
    ADD [InMeasurementInterval] [bit] NULL
GO

ALTER TABLE [dbo].[LoadTestTransactionDetail] 
    ADD [EndTime] [datetime] NULL
GO

ALTER TABLE [dbo].[LoadTestTransactionDetail] 
    ADD [InMeasurementInterval] [bit] NULL
GO

ALTER TABLE [dbo].[LoadTestTransactionDetail] 
    ADD [ResponseTime] [float] NULL
GO

ALTER TABLE [dbo].[LoadTestRun] 
    ADD [LoadTestSchemaRev] [int] NULL
GO

ALTER TABLE [dbo].[LoadTestRun] 
    ADD [CooldownTime] [int] NULL
GO

ALTER TABLE [dbo].[WebLoadTestRequestMap]
    ADD [ResponseTimeGoal] [FLOAT] NULL
GO

ALTER TABLE [dbo].[LoadTestPerformanceCounter]
    ADD [HigherIsBetter] [bit] NULL
GO

ALTER TABLE [dbo].[WebLoadTestTransaction]
    ADD [Goal] [float] NULL   
GO

-- Tables added for storing system under test role tags

CREATE TABLE [dbo].[LoadTestSystemUnderTest] (
	[LoadTestRunId] [int] NOT NULL ,
	[SystemUnderTestId] [int] NOT NULL ,
	[MachineName] [nvarchar] (255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL ,
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[LoadTestSystemUnderTest] WITH NOCHECK ADD 
	 PRIMARY KEY  CLUSTERED 
	(
		[LoadTestRunId],
		[SystemUnderTestId]
	)  ON [PRIMARY] 
GO

ALTER TABLE [dbo].[LoadTestSystemUnderTest] 
	ADD FOREIGN KEY 
	(
		[LoadTestRunId]
	) REFERENCES [dbo].[LoadTestRun] (
		[LoadTestRunId]
	)
GO

GRANT SELECT, INSERT, UPDATE ON [dbo].[LoadTestSystemUnderTest] TO PUBLIC
GO
ALTER TABLE [dbo].[LoadTestTestSummaryData]
    ADD [Percentile99] float NULL

GO
ALTER TABLE [dbo].[LoadTestTestSummaryData]
    ADD [Median] float NULL

GO
ALTER TABLE [dbo].[LoadTestTestSummaryData]
    ADD [StandardDeviation] float NULL 
GO

ALTER TABLE [dbo].[LoadTestTransactionSummaryData]
    ADD [Percentile99] float NULL

GO
ALTER TABLE [dbo].[LoadTestTransactionSummaryData]
    ADD [Median] float NULL

GO
ALTER TABLE [dbo].[LoadTestTransactionSummaryData]
    ADD [StandardDeviation] float NULL 
GO

ALTER TABLE [dbo].[LoadTestTransactionSummaryData]
    ADD [AvgTransactionTime] float NULL 
GO

ALTER TABLE [dbo].[LoadTestPageSummaryData]
    ADD [Percentile99] float NULL

GO
ALTER TABLE [dbo].[LoadTestPageSummaryData]
    ADD [Median] float NULL

GO
ALTER TABLE [dbo].[LoadTestPageSummaryData]
    ADD [StandardDeviation] float NULL 
GO

ALTER TABLE [dbo].[LoadTestPageSummaryByNetwork]
    ADD [Percentile99] float NULL

GO
ALTER TABLE [dbo].[LoadTestPageSummaryByNetwork]
    ADD [Median] float NULL

GO
ALTER TABLE [dbo].[LoadTestPageSummaryByNetwork]
    ADD [StandardDeviation] float NULL 
GO



CREATE TABLE [dbo].[LoadTestSystemUnderTestTag] (
	[LoadTestRunId] [int] NOT NULL ,
	[SystemUnderTestId] [int] NOT NULL ,
	[MachineTag] [nvarchar] (255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL ,
) ON [PRIMARY]
GO

GRANT SELECT, INSERT, UPDATE ON [dbo].[LoadTestSystemUnderTestTag] TO PUBLIC
GO

ALTER TABLE [dbo].[LoadTestSystemUnderTestTag] 
	ADD FOREIGN KEY 
	(
		[LoadTestRunId]
	) REFERENCES [dbo].[LoadTestRun] (
		[LoadTestRunId]
	)
GO

CREATE TABLE [dbo].[LoadTestMessageType] (
	[LoadTestRunId] [int] NOT NULL ,
	[MessageTypeId] [int] NOT NULL,
	[MessageType] [tinyint] NOT NULL ,
	[SubType] [nvarchar] (64) COLLATE SQL_Latin1_General_CP1_CI_AS NULL
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[LoadTestMessageType] WITH NOCHECK ADD 
	 PRIMARY KEY  CLUSTERED 
	(
		[LoadTestRunId],
		[MessageTypeId]
	)  ON [PRIMARY] 
GO

GRANT SELECT, INSERT, UPDATE ON [dbo].[LoadTestMessageType] TO PUBLIC
GO

CREATE TABLE [dbo].[LoadTestDetailMessage] (
	[LoadTestRunId] [int] NOT NULL ,
        [LoadTestDetailMessageId] [int] NOT NULL ,
	[TestDetailId] [int] NOT NULL ,
	[PageDetailId] [int] NULL ,
	[MessageTypeId] [int] NOT NULL	
) ON [PRIMARY]


ALTER TABLE [dbo].[LoadTestDetailMessage] WITH NOCHECK ADD 
	 PRIMARY KEY  CLUSTERED 
	(
		[LoadTestRunId],
		[LoadTestDetailMessageId]
	)  ON [PRIMARY] 
GO

GRANT SELECT, INSERT, UPDATE ON [dbo].[LoadTestDetailMessage] TO PUBLIC
GO

-- Tables added for storing inner test results

CREATE TABLE [dbo].[LoadTestTestLog] (
	[LoadTestRunId] [int] NOT NULL ,
	[AgentId] [int] NOT NULL ,
	[TestCaseId] [int] NOT NULL ,
	[TestLogId] [int] NOT NULL ,
	[TestLog] [image] NOT NULL
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[LoadTestTestLog] WITH NOCHECK ADD 
	 PRIMARY KEY  CLUSTERED 
	(
		[LoadTestRunId],
		[TestLogId],
		[AgentId]
	)  ON [PRIMARY] 
GO

ALTER TABLE [dbo].[LoadTestTestLog] 
	ADD FOREIGN KEY 
	(
		[LoadTestRunId]
	) REFERENCES [dbo].[LoadTestRun] (
		[LoadTestRunId]
	)
GO

GRANT SELECT, INSERT, UPDATE ON [dbo].[LoadTestTestLog] TO PUBLIC
GO

-- Tables added for log sources from data collectors

CREATE TABLE [dbo].[LoadTestDataCollectorLog] (
	[LoadTestRunId] [int] NOT NULL ,
	[DataCollectorLogId] [int] NOT NULL ,
	[DataCollectorDisplayName] [nvarchar] (255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL ,
	[MachineName] [nvarchar] (255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL ,
	[TimestampColumnName] [nvarchar] (128) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	[DurationColumnName] [nvarchar] (128) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,	
	[CreateTableFormatString] [nvarchar] (max) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL	
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[LoadTestDataCollectorLog] WITH NOCHECK ADD 
	 PRIMARY KEY  CLUSTERED 
	(
		[LoadTestRunId],
		[DataCollectorLogId]
	)  ON [PRIMARY] 
GO

ALTER TABLE [dbo].[LoadTestDataCollectorLog] 
	ADD FOREIGN KEY 
	(
		[LoadTestRunId]
	) REFERENCES [dbo].[LoadTestRun] (
		[LoadTestRunId]
	)
GO

GRANT SELECT, INSERT, UPDATE ON [dbo].[LoadTestDataCollectorLog] TO PUBLIC
GO

CREATE TABLE [dbo].[LoadTestFileAttachment] (
	[LoadTestRunId] [int] NOT NULL ,
	[FileAttachmentId] [int] NOT NULL ,
	[MachineName] [nvarchar] (255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL ,
	[Filename] [nvarchar] (260) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL ,
	[FileSize] [bigint] NOT NULL
) ON [PRIMARY]
GO

GRANT SELECT, INSERT, UPDATE ON [dbo].[LoadTestFileAttachment] TO PUBLIC
GO

ALTER TABLE [dbo].[LoadTestFileAttachment] WITH NOCHECK ADD 
	 PRIMARY KEY  CLUSTERED 
	(
		[LoadTestRunId],
		[FileAttachmentId]
	)  ON [PRIMARY]
GO

ALTER TABLE [dbo].[LoadTestFileAttachment] 
	ADD FOREIGN KEY 
	(
		[LoadTestRunId]
	) REFERENCES [dbo].[LoadTestRun] (
		[LoadTestRunId]
	)
GO

CREATE TABLE [dbo].[LoadTestFileAttachmentChunk] (
	[LoadTestRunId] [int] NOT NULL ,
	[FileAttachmentId] [int] NOT NULL ,
	[StartOffset] [bigint] NOT NULL ,
	[EndOffset] [bigint] NOT NULL ,
	[ChunkLength] [bigint] NOT NULL ,
	[ChunkBytes] [image] NOT NULL
) ON [PRIMARY]
GO

GRANT SELECT, INSERT, UPDATE ON [dbo].[LoadTestFileAttachmentChunk] TO PUBLIC
GO

ALTER TABLE [dbo].[LoadTestFileAttachmentChunk] WITH NOCHECK ADD 
	 PRIMARY KEY  CLUSTERED 
	(
		[LoadTestRunId],
		[FileAttachmentId],
		[StartOffset]
	)  ON [PRIMARY]
GO

ALTER TABLE [dbo].[LoadTestFileAttachmentChunk] 
	ADD FOREIGN KEY 
	(
		[LoadTestRunId]
	) REFERENCES [dbo].[LoadTestRun] (
		[LoadTestRunId]
	)
GO

-- Create indices on detail tables
CREATE NONCLUSTERED INDEX [LoadTestTestDetail4] ON [dbo].[LoadTestTestDetail] ([LoadTestRunId] ASC, [TestCaseId] ASC,[InMeasurementInterval] ASC, [ElapsedTime] DESC) WITH (DROP_EXISTING = ON)

CREATE NONCLUSTERED INDEX [LoadTestTestDetail5] ON [dbo].[LoadTestTestDetail] ([LoadTestRunId] ASC, [TestCaseId] ASC) INCLUDE ([TestDetailId],[AgentId],[BrowserId],[NetworkId],[TestLogId],[UserId])

CREATE NONCLUSTERED INDEX [LoadTestTestDetail6] ON [dbo].[LoadTestTestDetail] ([LoadTestRunId] ASC, [TestCaseId] ASC,	[EndTime] ASC,[Outcome] ASC,[TimeStamp] ASC,[TestDetailId] ASC,[AgentId] ASC,[NetworkId] ASC,[UserId] ASC) INCLUDE ( [ElapsedTime], [TestLogId])

CREATE NONCLUSTERED INDEX [LoadTestTransactionDetail4] ON [dbo].[LoadTestTransactionDetail] ([LoadTestRunId] ASC, [TransactionId] ASC,[InMeasurementInterval] ASC,  [ResponseTime] DESC, [TestDetailId] ASC ) INCLUDE ( [TimeStamp],[EndTime]) WITH (DROP_EXISTING = ON)

CREATE NONCLUSTERED INDEX [LoadTestTransactionDetail5] ON [dbo].[LoadTestTransactionDetail] ([TestDetailId] ASC,[LoadTestRunId] ASC,[TransactionId] ASC,[EndTime] ASC,[TimeStamp] ASC,[TransactionDetailId] ASC) INCLUDE ( [ElapsedTime])

CREATE NONCLUSTERED INDEX [LoadTestPageDetail4] ON [dbo].[LoadTestPageDetail] ([LoadTestRunId] ASC,  [PageId] ASC,[InMeasurementInterval] ASC,[ResponseTime] DESC ) INCLUDE ([TestDetailId],[ResponseTimeGoal])  WITH (DROP_EXISTING = ON)

CREATE NONCLUSTERED INDEX [LoadTestPageDetail5] ON [dbo].[LoadTestPageDetail] ( [LoadTestRunId] ASC, [PageId] ASC, [TestDetailId] ASC, [EndTime] ASC, [Outcome] ASC, [TimeStamp] ASC, [PageDetailId] ASC) INCLUDE ( [ResponseTime])

CREATE NONCLUSTERED INDEX ix_LoadTestDetailMessage_LoadTestRunId_TestDetailId_PageDetailId__MessageTypeId ON
        dbo.LoadTestDetailMessage
        (
            [LoadTestRunId] ASC,
	    [TestDetailId] ASC,
	    [PageDetailId] ASC,
	    [MessageTypeId] ASC
        )

CREATE NONCLUSTERED INDEX ix_WebLoadTestRequestMap_RequestId_LoadTestRunId_TestCaseId ON
        dbo.WebLoadTestRequestMap
        (
            [RequestId] ASC,
            [LoadTestRunId] ASC
        )
        INCLUDE ( [TestCaseId])

GO 

CREATE VIEW [dbo].[LoadTestMessageView2] AS
SELECT 
message.LoadTestRunId,
agent.AgentName,
scenario.ScenarioName,
testcase.TestCaseName,
requestmap.RequestUri,
message.MessageId,
message.MessageTimeStamp,
message.MessageType,
message.SubType,
message.MessageText,
message.StackTrace,
message.RequestId,
HasWebTestErrorDetail = 
    CASE ISNULL(detail.MessageId,-1)
	WHEN -1 THEN 'false'
	ELSE 'true'
    END,
testLog.TestLogId
FROM LoadTestMessage as message
LEFT OUTER JOIN LoadTestCase AS testcase
    ON message.LoadTestRunId = testcase.LoadTestRunId
    AND message.TestCaseId = testcase.TestCaseId
LEFT OUTER JOIN LoadTestScenario AS scenario
    ON testcase.LoadTestRunId = scenario.LoadTestRunId
    AND testcase.ScenarioId = scenario.ScenarioId
LEFT OUTER JOIN LoadTestRunAgent AS agent
    ON message.LoadTestRunId = agent.LoadTestRunId
    AND message.AgentId = agent.AgentId
LEFT OUTER JOIN WebLoadTestRequestMap AS requestmap
    ON message.LoadTestRunId = requestmap.LoadTestRunId
    AND message.RequestId = requestmap.RequestId        
LEFT OUTER JOIN WebLoadTestErrorDetail AS detail
    ON message.LoadTestRunId = detail.LoadTestRunId
    AND message.MessageId = detail.MessageId
    AND message.AgentId = detail.AgentId        
LEFT OUTER JOIN LoadTestTestLog AS testLog
    ON message.LoadTestRunId = testLog.LoadTestRunId
    AND message.AgentId = testLog.AgentId     
    AND message.TestLogId = testLog.TestLogId

GO
GRANT SELECT ON [dbo].[LoadTestMessageView2] TO PUBLIC
GO

CREATE VIEW LoadTestPageResultsByNetwork2 AS 
SELECT
    pageSummary.LoadTestRunId,
    scenario.ScenarioName,
    testCase.TestCaseName, 
    requestMap.RequestUri,
    networks.NetworkName,
    pageSummary.PageCount,
    pageSummary.Minimum,
    pageSummary.Average,
    pageSummary.Median,
    pageSummary.Percentile90,
    pageSummary.Percentile95,
    pageSummary.Percentile99,
    pageSummary.Maximum,
    pageSummary.StandardDeviation,
    pageSummary.Goal,
    pageSummary.PagesMeetingGoal
FROM LoadTestPageSummaryByNetwork AS pageSummary
INNER JOIN WebLoadTestRequestMap AS requestMap 
    ON pageSummary.LoadTestRunId = requestMap.LoadTestRunId
    AND pageSummary.PageId = requestMap.requestId
INNER JOIN LoadTestCase as testCase
    ON requestMap.LoadTestRunId = testCase.LoadTestRunId
    AND requestMap.TestCaseId = testCase.TestCaseId
INNER JOIN LoadTestScenario As scenario
    ON testcase.LoadTestRunId = scenario.LoadTestRunId
    AND testcase.ScenarioId = scenario.ScenarioId
INNER JOIN LoadTestNetworks as networks
    ON pageSummary.LoadTestRunId = networks.LoadTestRunId
    AND pageSummary.NetworkId = networks.NetworkId
GO

GRANT SELECT ON [dbo].LoadTestPageResultsByNetwork2 TO PUBLIC
GO

CREATE VIEW [dbo].[LoadTestTransactionResults2] AS 
SELECT
    transactionSummary.LoadTestRunId, 
    scenario.ScenarioName,
    testCase.TestCaseName, 
    transactions.TransactionName,
    transactionSummary.TransactionCount, 
    transactionSummary.Minimum, 
    transactionSummary.Average,    
    transactionSummary.Percentile90, 
    transactionSummary.Percentile95, 
    transactionSummary.Maximum,
    transactionSummary.Median,
    transactionSummary.Percentile99,
    transactionSummary.StandardDeviation,
    transactionSummary.AvgTransactionTime
FROM LoadTestTransactionSummaryData AS transactionSummary 
INNER JOIN WebLoadTestTransaction AS transactions 
    ON transactionSummary.LoadTestRunId = transactions.LoadTestRunId
    AND transactionSummary.TransactionId = transactions.TransactionId
INNER JOIN LoadTestCase as testCase
    ON transactions.LoadTestRunId = testCase.LoadTestRunId
    AND transactions.TestCaseId = testCase.TestCaseId
INNER JOIN LoadTestScenario As scenario
    ON testcase.LoadTestRunId = scenario.LoadTestRunId
    AND testcase.ScenarioId = scenario.ScenarioId
GO

GRANT SELECT ON [dbo].LoadTestTransactionResults2 TO PUBLIC
GO

CREATE PROCEDURE Prc_DeleteDataCollectorLogs @LoadTestRunId int
AS
BEGIN
	DECLARE @DataCollectorLogId int
	
	DECLARE LogCursor CURSOR FOR
		SELECT DataCollectorLogId FROM LoadTestDataCollectorLog WHERE LoadTestRunId = @LoadTestRunId

	OPEN LogCursor
	FETCH NEXT FROM LogCursor INTO @DataCollectorLogId

	WHILE @@FETCH_STATUS = 0
	BEGIN
	   DECLARE @DropStmt nvarchar(255)
	   Set @DropStmt = N'DROP TABLE LoadTestLogData_Run' + RTRIM(CONVERT(nvarchar, @LoadTestRunId)) + N'_Log' + RTRIM(CONVERT(nvarchar, @DataCollectorLogId));
	   EXEC (@DropStmt);
	   FETCH NEXT FROM LogCursor INTO @DataCollectorLogId
	END
	
	CLOSE LogCursor
	DEALLOCATE LogCursor
END

GRANT EXECUTE ON Prc_DeleteDataCollectorLogs TO PUBLIC
GO

DROP PROCEDURE Prc_DeleteLoadTestRun
GO

CREATE PROCEDURE Prc_DeleteLoadTestRun @LoadTestRunId int
AS
BEGIN

    -- First delete the data collector log tables
    EXEC Prc_DeleteDataCollectorLogs @LoadTestRunId

    ----------------------------------------------------------------
    -- TempTable to handle the tables to use for delete.
    -- rownum will insure we retrieve in the right order
    -- so foreign key constraints don't bite us
    DECLARE @Temp TABLE
          (rownum int
           , tableToUse nvarchar(50))

    -- Build out temp table, 
    INSERT INTO @temp VALUES(1, 'LoadTestFileAttachmentChunk')
    INSERT INTO @temp VALUES(2, 'LoadTestFileAttachment')
    INSERT INTO @temp VALUES(3, 'LoadTestDataCollectorLog')
    INSERT INTO @temp VALUES(4, 'LoadTestTestLog')
    INSERT INTO @temp VALUES(5, 'LoadTestBrowsers')
    INSERT INTO @temp VALUES(6, 'LoadTestNetworks')
    INSERT INTO @temp VALUES(7, 'LoadTestDetailMessage')
    INSERT INTO @temp VALUES(8, 'LoadTestTestDetail')
    INSERT INTO @temp VALUES(9, 'LoadTestPageDetail')
    INSERT INTO @temp VALUES(10, 'LoadTestTransactionDetail')
    INSERT INTO @temp VALUES(11, 'LoadTestTestSummaryData')
    INSERT INTO @temp VALUES(12, 'LoadTestTransactionSummaryData')
    INSERT INTO @temp VALUES(13, 'LoadTestPageSummaryData')
    INSERT INTO @temp VALUES(14, 'LoadTestPageSummaryByNetwork')
    INSERT INTO @temp VALUES(15, 'LoadTestCase')
    INSERT INTO @temp VALUES(16, 'LoadTestMessage')
    INSERT INTO @temp VALUES(17, 'LoadTestMessageType')
    INSERT INTO @temp VALUES(18, 'LoadTestThresholdMessage')
    INSERT INTO @temp VALUES(19, 'LoadTestPerformanceCounter')
    INSERT INTO @temp VALUES(20, 'LoadTestPerformanceCounterCategory')
    INSERT INTO @temp VALUES(21, 'LoadTestPerformanceCounterInstance')
    INSERT INTO @temp VALUES(22, 'LoadTestPerformanceCounterSample')
    INSERT INTO @temp VALUES(23, 'LoadTestRunAgent')
    INSERT INTO @temp VALUES(24, 'LoadTestRunInterval')
    INSERT INTO @temp VALUES(25, 'LoadTestScenario')
    INSERT INTO @temp VALUES(26, 'LoadTestSqlTrace')
    INSERT INTO @temp VALUES(27, 'WebLoadTestErrorDetail')
    INSERT INTO @temp VALUES(28, 'WebLoadTestTransaction')
    INSERT INTO @temp VALUES(29, 'WebLoadTestRequestMap')
    INSERT INTO @temp VALUES(30, 'LoadTestSystemUnderTestTag')
    INSERT INTO @temp VALUES(31, 'LoadTestSystemUnderTest')
    INSERT INTO @temp VALUES(32, 'LoadTestRun')

    ----------------------------------------------------------------
    -- Variables to control the behavior of the query
    DECLARE @iEndOfTable int
    DECLARE @iRowsToDelete int
    DECLARE @iRownum int
    DECLARE @tableName nvarchar(50)
    DECLARE @QueryToUse nvarchar(500)

    set @iEndOfTable = 0
    SET @iRowsToDelete = 10000
    SET @iRownum = 1


    WHILE @iRownum < 33
    BEGIN
          SELECT @tableName = tableToUse FROM @TEMP WHERE rownum = @iRownum
          WHILE @iEndOfTable = 0
          BEGIN
                SET @QueryToUse = 'DELETE TOP(' + CAST(@iRowsToDelete AS nvarchar(10)) + ') FROM ' +
                            @tableName + ' WHERE LoadTestRunId = ' +  CAST(@LoadTestRunId AS nvarchar(10))
                EXECUTE sp_executesql @QueryToUse
                IF (@@rowcount < @iRowsToDelete)
                      SET @iEndOfTable = 1
          END
          SET @iRownum = @iRownum + 1
          SET @iEndOfTable = 0
    END
END
GO

GRANT EXECUTE ON Prc_DeleteLoadTestRun TO PUBLIC
GO

CREATE PROCEDURE Prc_GetMessagesByRequest2
	@LoadTestRunId int, @RequestId int
AS
SELECT 
AgentName,
ScenarioName,
TestCaseName,
RequestUri,
MessageId,
MessageTimeStamp,
MessageType,
SubType,
MessageText,
StackTrace,
HasWebTestErrorDetail,
TestLogId
FROM LoadTestMessageView2
WHERE
LoadTestRunId = @LoadTestRunId AND
RequestId = @RequestId
ORDER BY AgentName, MessageId
GO

GRANT EXECUTE ON Prc_GetMessagesByRequest2 TO PUBLIC
GO

CREATE PROCEDURE Prc_GetMessagesByAgent2
	@LoadTestRunId int, @AgentName nvarchar(255)
AS
SELECT 
AgentName,
ScenarioName,
TestCaseName,
RequestUri,
MessageId,
MessageTimeStamp,
MessageType,
SubType,
MessageText,
StackTrace,
HasWebTestErrorDetail,
TestLogId
FROM LoadTestMessageView2
WHERE
LoadTestRunId = @LoadTestRunId AND
AgentName = @AgentName
ORDER BY AgentName, MessageId
GO

GRANT EXECUTE ON Prc_GetMessagesByAgent2 TO PUBLIC
GO

CREATE PROCEDURE Prc_GetMessagesByTest2
	@LoadTestRunId int, @ScenarioName nvarchar(64), @TestCaseName nvarchar(64)
AS
SELECT 
AgentName,
ScenarioName,
TestCaseName,
RequestUri,
MessageId,
MessageTimeStamp,
MessageType,
SubType,
MessageText,
StackTrace,
HasWebTestErrorDetail,
TestLogId
FROM LoadTestMessageView2
WHERE
LoadTestRunId = @LoadTestRunId AND
ScenarioName = @ScenarioName AND
TestCaseName = @TestCaseName
ORDER BY AgentName, ScenarioName, TestCaseName
GO

GRANT EXECUTE ON Prc_GetMessagesByTest2 TO PUBLIC
GO

CREATE PROCEDURE Prc_GetMessagesByType2
	@LoadTestRunId int, @MessageType tinyint, @SubType nvarchar(64)
AS
SELECT 
AgentName,
ScenarioName,
TestCaseName,
RequestUri,
MessageId,
MessageTimeStamp,
MessageType,
SubType,
MessageText,
StackTrace,
HasWebTestErrorDetail,
TestLogId
FROM LoadTestMessageView2
WHERE
LoadTestRunId = @LoadTestRunId AND
MessageType = @MessageType AND
SubType = @SubType
ORDER BY AgentName, MessageType, SubType
GO

GRANT EXECUTE ON Prc_GetMessagesByType2 TO PUBLIC
GO

CREATE PROCEDURE Prc_GetMessagesAll2
	@LoadTestRunId int
AS
SELECT 
AgentName,
ScenarioName,
TestCaseName,
RequestUri,
MessageId,
MessageTimeStamp,
MessageType,
SubType,
MessageText,
StackTrace,
HasWebTestErrorDetail,
TestLogId
FROM LoadTestMessageView2
WHERE
LoadTestRunId = @LoadTestRunId
ORDER BY AgentName, MessageType, SubType
GO

GRANT EXECUTE ON Prc_GetMessagesAll2 TO PUBLIC
GO

CREATE PROCEDURE Prc_GetTestLog
	@LoadTestRunId int, @AgentName nvarchar(255), @TestLogId int
AS
SELECT
testLog.TestLog,
testcase.TestElement
FROM LoadTestTestLog as testLog
LEFT OUTER JOIN LoadTestCase AS testcase
    ON testLog.LoadTestRunId = testcase.LoadTestRunId
    AND testLog.TestCaseId = testcase.TestCaseId
LEFT OUTER JOIN LoadTestRunAgent AS agent
    ON testLog.LoadTestRunId = agent.LoadTestRunId
    AND testLog.AgentId = agent.AgentId
WHERE
testLog.LoadTestRunId = @LoadTestRunId AND
AgentName = @AgentName AND
TestLogId = @TestLogId
GO

GRANT EXECUTE ON Prc_GetTestLog TO PUBLIC
GO

CREATE PROCEDURE Prc_InsertTestDetail2
	@LoadTestRunId int,
	@TestDetailId int,
	@TimeStamp datetime,
	@TestCaseId int,
	@ElapsedTime float,
    @AgentId int,
    @BrowserId int,
    @NetworkId int,
    @Outcome tinyint,
    @TestLogId int,
    @UserId int,
    @EndTime datetime,
	@InMeasurementInterval bit
AS
INSERT INTO LoadTestTestDetail
(
	LoadTestRunId,
	TestDetailId,
	TimeStamp,
	TestCaseId,
	ElapsedTime,
    AgentId,
    BrowserId,
    NetworkId,
    Outcome,
    TestLogId,
    UserId,
    EndTime,
	InMeasurementInterval
)
VALUES(
	@LoadTestRunId,
	@TestDetailId,
	@TimeStamp,
	@TestCaseId,
	@ElapsedTime,
    @AgentId,
    @BrowserId,
    @NetworkId,
    @Outcome,
    @TestLogId,
    @UserId,
    @EndTime,
	@InMeasurementInterval
)
GO
GRANT EXECUTE ON Prc_InsertTestDetail2 TO PUBLIC
GO

CREATE PROCEDURE [dbo].[Prc_InsertTransactionDetail2]
	@LoadTestRunId int,
	@TransactionDetailId int,
	@TestDetailId int,
	@TimeStamp datetime,
        @EndTime datetime,
	@TransactionId int,
	@ElapsedTime float,
	@InMeasurementInterval bit,
        @ResponseTime float    
AS
INSERT INTO LoadTestTransactionDetail
(
	LoadTestRunId,
	TransactionDetailId,
	TestDetailId,
	TimeStamp,
        EndTime,
	TransactionId,
	ElapsedTime,
	InMeasurementInterval,
         ResponseTime  
)
VALUES(
	@LoadTestRunId,
	@TransactionDetailId,
	@TestDetailId,
	@TimeStamp,
        @EndTime,
	@TransactionId,
	@ElapsedTime,
	@InMeasurementInterval,
	@ResponseTime
    
)
GO
GRANT EXECUTE ON Prc_InsertTransactionDetail2 TO PUBLIC
GO


CREATE PROCEDURE [dbo].[Prc_InsertPageDetail2]
	@LoadTestRunId int,
	@PageDetailId int,
	@TestDetailId int,
	@TimeStamp datetime,
        @EndTime datetime,
	@PageId int,
	@ResponseTime float,
	@ResponseTimeGoal float,
	@GoalExceeded bit,
        @Outcome tinyint,
	@InMeasurementInterval bit
AS
INSERT INTO LoadTestPageDetail
(
	LoadTestRunId,
	PageDetailId,
	TestDetailId,
	TimeStamp,
        EndTime,
	PageId,
	ResponseTime,
	ResponseTimeGoal,
	GoalExceeded,
        Outcome,
	InMeasurementInterval
)
VALUES(
	@LoadTestRunId,
	@PageDetailId,
	@TestDetailId,
	@TimeStamp,
        @EndTime,
	@PageId,
	@ResponseTime,
	@ResponseTimeGoal,
	@GoalExceeded,
        @Outcome,
	@InMeasurementInterval
)
GO
GRANT EXECUTE ON Prc_InsertPageDetail2 TO PUBLIC
GO

CREATE PROCEDURE [dbo].[Prc_InsertLoadTestMessageType]
	@LoadTestRunId int,
        @MessageTypeId int, 
        @MessageType tinyint, 
        @SubType nvarchar(64)
AS
INSERT INTO LoadTestMessageType
(
	LoadTestRunId,
	MessageTypeId,
	MessageType,
        SubType 
)
VALUES(
	@LoadTestRunId,
	@MessageTypeId,
	@MessageType,
        @SubType    
)
GO
GRANT EXECUTE ON Prc_InsertLoadTestMessageType TO PUBLIC
GO

CREATE PROCEDURE [dbo].[Prc_InsertLoadTestDetailMessage]
	@LoadTestRunId int,
        @LoadTestDetailMessageId int,
        @TestDetailId int, 
        @PageDetailId int,
        @MessageTypeId int
AS
INSERT INTO LoadTestDetailMessage
(
	LoadTestRunId,
        LoadTestDetailMessageId,
	TestDetailId,
	PageDetailId,
	MessageTypeId 
)
VALUES(
	@LoadTestRunId,
        @LoadTestDetailMessageId,
	@TestDetailId,
	@PageDetailId,
	@MessageTypeId
)
GO
GRANT EXECUTE ON Prc_InsertLoadTestDetailMessage TO PUBLIC
GO


CREATE PROCEDURE Prc_InsertTestLog
    @LoadTestRunId int,
    @AgentId int,
	@TestCaseId int,
    @TestLogId int,
    @TestLog image      
AS
INSERT INTO LoadTestTestLog
(
    LoadTestRunId,
    AgentId,
	TestCaseId,
    TestLogId,
    TestLog
)
VALUES(
    @LoadTestRunId,
    @AgentId,
	@TestCaseId,
    @TestLogId,
    @TestLog
)
GO

GRANT EXECUTE ON Prc_InsertTestLog TO PUBLIC
GO

CREATE PROCEDURE Prc_InsertFileAttachmentChunk
    @LoadTestRunId int,
    @FileAttachmentId int,
    @StartOffset bigint,
    @EndOffset bigint,
    @ChunkLength bigint,
    @ChunkBytes image      
AS
INSERT INTO LoadTestFileAttachmentChunk
(
    LoadTestRunId,
    FileAttachmentId,
    StartOffset,
    EndOffset,
    ChunkLength,
    ChunkBytes
)
VALUES(
    @LoadTestRunId,
    @FileAttachmentId,
    @StartOffset,
    @EndOffset,
    @ChunkLength,
    @ChunkBytes
)
GO

GRANT EXECUTE ON Prc_InsertFileAttachmentChunk TO PUBLIC
GO

CREATE TABLE [dbo].[LoadTestSchemaRevision] (
	[LoadTestSchemaRev] [int] NOT NULL
) ON [PRIMARY]
GO

GRANT SELECT, INSERT, UPDATE ON [dbo].[LoadTestSchemaRevision] TO PUBLIC
GO

INSERT INTO [dbo].[LoadTestSchemaRevision] ([LoadTestSchemaRev]) VALUES (3)
GO

ALTER VIEW [dbo].[LoadTestPageSummary] AS
SELECT run.LoadTestName, 
       category.LoadTestRunId, 
       counter.CounterName,
       ISNULL(scenario.ScenarioName,'_Total') as ScenarioName,
       ISNULL(testcase.TestCaseName,'_Total') as TestCaseName, 
       ISNULL(request.RequestUri,'_Total') as RequestUri, 
       instance.CumulativeValue,
       ISNULL(request.ResponseTimeGoal,0) AS ResponseTimeGoal
FROM       LoadTestRun AS run
INNER JOIN LoadTestPerformanceCounterCategory AS category 
    ON run.LoadTestRunId = category.LoadTestRunId
INNER JOIN LoadTestPerformanceCounter AS counter 
    ON category.LoadTestRunId = counter.LoadTestRunId
    AND category.CounterCategoryId = counter.CounterCategoryId
INNER JOIN LoadTestPerformanceCounterInstance AS instance 
    ON counter.CounterId = instance.CounterId
    AND counter.LoadTestRunId = instance.LoadTestRunId
LEFT JOIN WebLoadTestRequestMap AS request
    ON request.LoadTestRunId = instance.LoadTestRunId
    AND request.RequestId = instance.LoadTestItemId
LEFT JOIN LoadTestCase As testcase
    ON request.LoadTestRunId = testcase.LoadTestRunId
    AND request.TestCaseId = testcase.TestCaseId
LEFT JOIN LoadTestScenario As scenario
    ON testcase.LoadTestRunId = scenario.LoadTestRunId
    AND testcase.ScenarioId = scenario.ScenarioId
WHERE category.CategoryName = 'LoadTest:Page' and instance.CumulativeValue IS NOT NULL
GO

ALTER VIEW [dbo].[LoadTestTransactionSummary] AS
SELECT run.LoadTestName, 
       category.LoadTestRunId, 
       counter.CounterName,
       ISNULL(scenario.ScenarioName,'_Total') as ScenarioName,
       ISNULL(testcase.TestCaseName,'_Total') as TestCaseName, 
       ISNULL(transactions.TransactionName,'_Total') as TransactionName,       
       instance.CumulativeValue
FROM  LoadTestRun as run
INNER JOIN LoadTestPerformanceCounterCategory AS category 
    ON run.LoadTestRunId = category.LoadTestRunId
INNER JOIN LoadTestPerformanceCounter AS counter 
    ON category.LoadTestRunId = counter.LoadTestRunId
    AND category.CounterCategoryId = counter.CounterCategoryId
INNER JOIN LoadTestPerformanceCounterInstance AS instance 
    ON counter.CounterId = instance.CounterId
    AND counter.LoadTestRunId = instance.LoadTestRunId
LEFT JOIN WebLoadTestTransaction AS transactions
    ON transactions.LoadTestRunId = instance.LoadTestRunId
    AND transactions.TransactionId = instance.LoadTestItemId
LEFT JOIN LoadTestCase As testcase
    ON transactions.LoadTestRunId = testcase.LoadTestRunId
    AND transactions.TestCaseId = testcase.TestCaseId
LEFT JOIN LoadTestScenario As scenario
    ON testcase.LoadTestRunId = scenario.LoadTestRunId
    AND testcase.ScenarioId = scenario.ScenarioId
WHERE category.CategoryName = 'LoadTest:Transaction' and instance.CumulativeValue IS NOT NULL
GO

ALTER VIEW LoadTestTestCaseSummary AS
SELECT run.LoadTestName, 
       category.LoadTestRunId, 
       counter.CounterName,
       ISNULL(scenario.ScenarioName,'_Total') as ScenarioName,
       ISNULL(testcase.TestCaseName,'_Total') as TestCaseName, 
       instance.CumulativeValue
FROM   LoadTestRun AS run
INNER JOIN LoadTestPerformanceCounterCategory AS category 
    ON run.LoadTestRunId = category.LoadTestRunId
INNER JOIN LoadTestPerformanceCounter AS counter 
    ON category.LoadTestRunId = counter.LoadTestRunId
    AND category.CounterCategoryId = counter.CounterCategoryId
INNER JOIN LoadTestPerformanceCounterInstance AS instance 
    ON counter.CounterId = instance.CounterId
    AND counter.LoadTestRunId = instance.LoadTestRunId
LEFT JOIN LoadTestCase As testcase
    ON counter.LoadTestRunId = testcase.LoadTestRunId
    AND testcase.TestCaseId = instance.LoadTestItemId
LEFT JOIN LoadTestScenario As scenario
    ON testcase.LoadTestRunId = scenario.LoadTestRunId
    AND testcase.ScenarioId = scenario.ScenarioId
WHERE category.CategoryName = 'LoadTest:Test' and instance.CumulativeValue IS NOT NULL
GO

ALTER VIEW [dbo].[LoadTestComputedCounterSummary] AS
SELECT run.LoadTestName, category.LoadTestRunId, category.MachineName, category.CategoryName, counter.CounterName, 
    counter.HigherIsBetter,instance.InstanceName, instance.CumulativeValue, instance.OverallThresholdRuleResult
FROM LoadTestRun as run
INNER JOIN LoadTestPerformanceCounterCategory AS category 
    ON run.LoadTestRunId = category.LoadTestRunId
INNER JOIN LoadTestPerformanceCounter AS counter 
    ON category.LoadTestRunId = counter.LoadTestRunId
    AND category.CounterCategoryId = counter.CounterCategoryId
INNER JOIN LoadTestPerformanceCounterInstance AS instance 
    ON counter.CounterId = instance.CounterId
    AND counter.LoadTestRunId = instance.LoadTestRunId
WHERE instance.cumulativeValue IS NOT NULL
GO

CREATE TABLE [dbo].[LoadTestReport](
	[ReportId] [INT] IDENTITY(1,1) NOT NULL,
	[Name] [NVARCHAR](255) NOT NULL,
	[Description] [NVARCHAR](MAX) NULL,
	[LoadTestName] [NVARCHAR](255) NOT NULL,
	[LastRunId] [INT] NOT NULL,
	[SelectNewRuns] [BIT] NOT NULL,
	[LastModified] DATETIME NOT NULL,
	[LastModifiedBy] [NVARCHAR](255) NOT NULL,
	[ReportType] [TINYINT] NOT NULL
) ON [PRIMARY] 
GO

ALTER TABLE [dbo].[LoadTestReport] WITH NOCHECK ADD 
	 PRIMARY KEY  CLUSTERED 
	(
		[ReportId]
	)  ON [PRIMARY] 
GO

GRANT SELECT, INSERT, UPDATE ON [dbo].[LoadTestReport] TO PUBLIC
GO

CREATE TABLE [dbo].[LoadTestReportRuns](
	[ReportId] [INT] NOT NULL,
	[LoadTestRunId] [INT] NOT NULL
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[LoadTestReportRuns] WITH NOCHECK ADD 
	 PRIMARY KEY  CLUSTERED 
	(
		[ReportId],
		[LoadTestRunId]
	)  ON [PRIMARY] 
GO

GRANT SELECT, INSERT, UPDATE ON [dbo].[LoadTestReportRuns] TO PUBLIC
GO

CREATE TABLE [dbo].[LoadTestReportPage](	
	[PageId] [INT] IDENTITY(1,1) NOT NULL,
	[ReportId] [INT] NOT NULL,	
	[CategoryName] [nvarchar](255) NOT NULL,
	[CounterName] [nvarchar](255) NOT NULL
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[LoadTestReportPage] WITH NOCHECK ADD 
	 PRIMARY KEY  CLUSTERED 
	(		
		[PageId]		
	)  ON [PRIMARY] 
GO

GRANT SELECT, INSERT, UPDATE ON [dbo].[LoadTestReportPage] TO PUBLIC
GO

CREATE PROCEDURE [dbo].[prc_CreateLoadTestReport]
    @name               NVARCHAR(255),
    @reportType         TINYINT,
    @description        NVARCHAR(MAX),
    @loadTestName       NVARCHAR(255), 
    @lastModifiedBy     NVARCHAR(255),
    @lastRunId          INT,
    @selectNewReports   BIT,
    @runsXml            NVARCHAR(MAX),
    @pageXml            NVARCHAR(MAX)

AS

SET NOCOUNT ON

DECLARE @status       INT
DECLARE @reportId     INT
DECLARE @docHandle    INT
DECLARE @lastModified DATETIME

SET @lastModified = GETUTCDATE()

DECLARE @runs TABLE (
    runId     INT NOT NULL    
)

DECLARE @pageInfo TABLE (
    categoryName  NVARCHAR(255) NOT NULL,
    counterName   NVARCHAR(255) NOT NULL  
)

-- Initialize the ProcedureName for error messages.
DECLARE @procedureName SYSNAME
SELECT  @procedureName = @@SERVERNAME + '.' + db_name() + '..' + object_name(@@PROCID)

BEGIN TRAN

INSERT LoadTestReport
       (
            Name,
            ReportType,
            Description,
            LoadTestName,
            LastRunId,
            SelectNewRuns,
            LastModified,
            LastModifiedBy
        )
VALUES  (
            @name,
            @reportType,
            @description,
            @loadTestName,
            @lastRunId,
            @selectNewReports,
            @lastModified,
            @lastModifiedBy            
        ) 

SELECT  @status = @@ERROR,
        @reportId = SCOPE_IDENTITY()
        
IF (@status <> 0)
BEGIN
    RAISERROR (560500, 16, -1, @procedureName, @status, N'INSERT', N'LoadTestReport')
    ROLLBACK TRAN
    RETURN 560500
END


-- Parse the XML input into a temporary table
EXEC sp_xml_preparedocument @docHandle OUTPUT, @runsXml

INSERT  @runs        
SELECT  i
FROM OPENXML(@docHandle, N'/runs/r', 0)
    WITH (        
        i INT
    )

SELECT  @status = @@ERROR

-- Done with the document now    
EXEC sp_xml_removedocument @docHandle

IF (@status <> 0)
BEGIN
    RAISERROR (560500, 16, -1, @procedureName, @status, N'INSERT', N'@runs')
    ROLLBACK TRAN
    RETURN 560500    
END

INSERT LoadTestReportRuns
SELECT @reportId,
       runId
FROM   @runs

SELECT  @status = @@ERROR

IF (@status <> 0)
BEGIN
    RAISERROR (560500, 16, -1, @procedureName, @status, N'INSERT', N'LoadTestReportRuns')
    ROLLBACK TRAN
    RETURN 560500
END

-- Parse the XML input into a temporary table
EXEC sp_xml_preparedocument @docHandle OUTPUT, @pageXml

INSERT  @pageInfo        
SELECT  c,
        t
FROM OPENXML(@docHandle, N'/pages/p', 0)
    WITH (        
        c NVARCHAR(255),
        t NVARCHAR(255)
    )

SELECT  @status = @@ERROR

-- Done with the document now    
EXEC sp_xml_removedocument @docHandle

IF (@status <> 0)
BEGIN
    RAISERROR (560500, 16, -1, @procedureName, @status, N'INSERT', N'@pageInfo')
    ROLLBACK TRAN
    RETURN 560500    
END

INSERT LoadTestReportPage
SELECT @reportId,
       categoryName,
       counterName
FROM   @pageInfo 
       

COMMIT TRAN

-- Return ID to caller
SELECT  @reportId AS ReportId,
        @lastModified as LastModified

-- Return Page Info
SELECT PageId, 
       ReportId,
       CategoryName,
       CounterName
FROM   LoadTestReportPage
WHERE  ReportId = @reportId
              
RETURN 0
GO

GRANT EXECUTE ON prc_CreateLoadTestReport TO PUBLIC
GO

CREATE PROCEDURE [dbo].[prc_UpdateLoadTestReport] 
    @reportId           INT,   
    @description        NVARCHAR(255),
    @loadTestName       NVARCHAR(255), 
    @lastModifiedBy     NVARCHAR(255),   
    @lastRunId          INT,
    @selectNewReports   BIT,
    @runsXml            NVARCHAR(MAX),
    @pageXml            NVARCHAR(MAX)

AS

SET NOCOUNT ON

DECLARE @status       INT
DECLARE @docHandle    INT
DECLARE @lastModified  DATETIME

SET @lastModified = GETUTCDATE()

DECLARE @runs TABLE (
    runId     INT NOT NULL    
)

DECLARE @pageInfo TABLE (
    pageId        INT NOT NULL,
    categoryName  NVARCHAR(255) NOT NULL,
    counterName   NVARCHAR(255) NOT NULL  
)

-- Initialize the ProcedureName for error messages.
DECLARE @procedureName SYSNAME
SELECT  @procedureName = @@SERVERNAME + '.' + db_name() + '..' + object_name(@@PROCID)

BEGIN TRAN

UPDATE LoadTestReport
SET    Description = @description,
       LoadTestName = @loadTestName,
       LastRunId = @lastRunId,
       SelectNewRuns = @selectNewReports,
       LastModifiedBy = @lastModifiedBy,
	   LastModified = @lastModified
WHERE  ReportId = @reportId
        
SELECT  @status = @@ERROR        
        
IF (@status <> 0)
BEGIN
    RAISERROR (560500, 16, -1, @procedureName, @status, N'UPDATE', N'LoadTestReport')
    ROLLBACK TRAN
    RETURN 560500
END


-- Parse the XML input into a temporary table
EXEC sp_xml_preparedocument @docHandle OUTPUT, @runsXml

INSERT  @runs        
SELECT  i
FROM OPENXML(@docHandle, N'/runs/r', 0)
    WITH (        
        i INT
    )

SELECT  @status = @@ERROR

-- Done with the document now    
EXEC sp_xml_removedocument @docHandle

IF (@status <> 0)
BEGIN
    RAISERROR (560500, 16, -1, @procedureName, @status, N'INSERT', N'@runs')
    ROLLBACK TRAN
    RETURN 560500    
END

--first delete runs that no longer exist
DELETE LoadTestReportRuns
FROM   LoadTestReportRuns ltr
LEFT JOIN @runs r
ON     ltr.LoadTestRunId = r.runId
WHERE  ltr.ReportId = @reportId
       AND r.runId IS NULL
       

SELECT  @status = @@ERROR

IF (@status <> 0)
BEGIN
    RAISERROR (560500, 16, -1, @procedureName, @status, N'DELETE', N'LoadTestReportRuns')
    ROLLBACK TRAN
    RETURN 560500
END

--Now insert new runs
INSERT    LoadTestReportRuns
SELECT    @reportId,
          runId
FROM      @runs r
LEFT JOIN LoadTestReportRuns ltr
ON        ltr.ReportId = @reportId
          AND r.runId = ltr.LoadTestRunId  
WHERE     ltr.LoadTestRunId IS NULL    

-- Parse the XML input into a temporary table
EXEC sp_xml_preparedocument @docHandle OUTPUT, @pageXml

INSERT  @pageInfo        
SELECT  i,
        c,
        t
FROM OPENXML(@docHandle, N'/pages/p', 0)
    WITH (
        i INT,        
        c NVARCHAR(255),
        t NVARCHAR(255)
    )

SELECT  @status = @@ERROR

-- Done with the document now    
EXEC sp_xml_removedocument @docHandle

IF (@status <> 0)
BEGIN
    RAISERROR (560500, 16, -1, @procedureName, @status, N'INSERT', N'@pageInfo')
    ROLLBACK TRAN
    RETURN 560500    
END

--first delete reports that no longer exist
DELETE    LoadTestReportPage
FROM      LoadTestReportPage p
LEFT JOIN @pageInfo i
ON        p.PageId = i.PageId
WHERE     p.ReportId = @reportId
          AND i.PageId IS NULL

INSERT    LoadTestReportPage
SELECT    @reportId,
          i.categoryName,
          i.counterName
FROM      @pageInfo i
LEFT JOIN LoadTestReportPage p
ON        p.ReportId = @reportId
          AND p.PageId = i.PageId
WHERE     p.PageId IS NULL
       

COMMIT TRAN

SELECT @lastModified as LastModified

-- Return Page Info
SELECT PageId, 
       ReportId,
       CategoryName,
       CounterName
FROM   LoadTestReportPage
WHERE  ReportId = @reportId
        
        
RETURN 0
GO

GRANT EXECUTE ON prc_UpdateLoadTestReport TO PUBLIC
GO

CREATE PROCEDURE [dbo].[prc_FindLoadTestReport] 
    @reportId           INT,
    @name               NVARCHAR(255)               

AS

SET NOCOUNT ON

IF (@reportId = -1) 
BEGIN
    SELECT @reportId = ReportId
    FROM   LoadTestReport
    WHERE  Name = @name
END

-- Return Report Info
SELECT Name, 
       ReportType,
       Description,
       LoadTestName,
       LastRunId,
       SelectNewRuns,
       LastModified,
       LastModifiedBy
FROM   LoadTestReport
WHERE  ReportId = @reportId

--return runs
SELECT LoadTestRunId
FROM   LoadTestReportRuns
WHERE  ReportId = @reportId

--return pages
SELECT PageId,
       @reportId,
       CategoryName,
       CounterName
FROM   LoadTestReportPage
WHERE  ReportId = @reportId
GO

GRANT EXECUTE ON prc_FindLoadTestReport TO PUBLIC
GO

CREATE PROCEDURE [dbo].[prc_QueryLoadTestReports]    
AS
SET NOCOUNT ON

-- Return Report Info
SELECT ReportId,
       ReportType,
       Name,
       LoadTestName,
       Description,
       SelectNewRuns,
       LastModified,
       LastModifiedBy
FROM   LoadTestReport
WHERE  Name != 'LOADTEST_RUNCOMPARISON_REPORT_DEFAULT'
       AND Name != 'LOADTEST_TREND_REPORT_DEFAULT'
ORDER BY LastModified DESC
GO

GRANT EXECUTE ON prc_QueryLoadTestReports TO PUBLIC
GO

CREATE PROCEDURE [dbo].[prc_QueryForInstanceCount]   
    @categoryName  NVARCHAR(255),
    @counterName   NVARCHAR(255),  
    @runsxml       NVARCHAR(MAX)
AS
SET NOCOUNT ON

DECLARE @docHandle    INT
DECLARE @runs TABLE (
    runId     INT NOT NULL    
)

-- Parse the XML input into a temporary table
EXEC sp_xml_preparedocument @docHandle OUTPUT, @runsxml

INSERT  @runs        
SELECT  i
FROM OPENXML(@docHandle, N'/runs/r', 0)
    WITH (        
        i INT
    )

-- Done with the document now    
EXEC sp_xml_removedocument @docHandle

-- Return Runs Info
SELECT TOP 1 run.runId, count(*) as InstanceCount
FROM @runs as run
INNER JOIN LoadTestPerformanceCounterCategory AS category 
    ON run.runId = category.LoadTestRunId
INNER JOIN LoadTestPerformanceCounter AS counter 
    ON category.LoadTestRunId = counter.LoadTestRunId
    AND category.CounterCategoryId = counter.CounterCategoryId
INNER JOIN LoadTestPerformanceCounterInstance AS instance 
    ON counter.CounterId = instance.CounterId
    AND counter.LoadTestRunId = instance.LoadTestRunId
WHERE instance.cumulativeValue IS NOT NULL
AND  counter.CounterName = @counterName
AND  category.CategoryName = @categoryName
GROUP BY run.runId
ORDER BY InstanceCount DESC

GRANT EXECUTE ON prc_QueryForInstanceCount TO PUBLIC
GO

CREATE PROCEDURE [dbo].[prc_QueryLoadTestRunsById]    
    @runsXml            NVARCHAR(MAX)
AS
SET NOCOUNT ON

DECLARE @status       INT
DECLARE @docHandle    INT

DECLARE @runs TABLE (
    runId     INT NOT NULL    
)

-- Parse the XML input into a temporary table
-- Initialize the ProcedureName for error messages.
DECLARE @procedureName SYSNAME
SELECT  @procedureName = @@SERVERNAME + '.' + db_name() + '..' + object_name(@@PROCID)

EXEC sp_xml_preparedocument @docHandle OUTPUT, @runsXml

INSERT  @runs        
SELECT  i
FROM OPENXML(@docHandle, N'/runs/r', 0)
    WITH (        
        i INT
    )

SELECT  @status = @@ERROR

-- Done with the document now    
EXEC sp_xml_removedocument @docHandle

IF (@status <> 0)
BEGIN
    RAISERROR (560500, 16, -1, @procedureName, @status, N'INSERT', N'@runs')
    ROLLBACK TRAN
    RETURN 560500    
END

-- Return Runs Info
SELECT LoadTestRunId, 
       ltr.RunId, 
       LoadTestName, 
       Description, 
       Comment, 
       IsLocalRun, 
       ControllerName, 
       StartTime, 
       EndTime, 
       WarmupTime, 
       RunDuration, 
       LoadTest, 
       Outcome,
       LoadTestSchemaRev
FROM   LoadTestRun ltr
JOIN   @runs r
ON     ltr.LoadTestRunId = r.runId
WHERE  StartTime IS NOT NULL 
       AND EndTime IS NOT NULL 
ORDER BY StartTime DESC
GO

GRANT EXECUTE ON prc_QueryLoadTestRunsById TO PUBLIC
GO

CREATE PROCEDURE [dbo].[prc_QueryLoadTestRuns]    
    @loadTestName        NVARCHAR(255)
AS
SET NOCOUNT ON

-- Return Runs Info
SELECT LoadTestRunId, 
       RunId, 
       LoadTestName, 
       Description, 
       Comment, 
       IsLocalRun, 
       ControllerName, 
       StartTime, 
       EndTime, 
       WarmupTime, 
       RunDuration, 
       LoadTest, 
       Outcome,
       LoadTestSchemaRev
FROM   LoadTestRun 
WHERE LoadTestName = @loadTestName 
      AND StartTime IS NOT NULL 
      AND EndTime IS NOT NULL 
ORDER BY StartTime DESC
GO

GRANT EXECUTE ON prc_QueryLoadTestRuns TO PUBLIC
GO


CREATE PROCEDURE [dbo].[prc_QueryPossibleCountersForReport]    
    @runsxml        NVARCHAR(MAX)
AS
SET NOCOUNT ON

DECLARE @docHandle    INT
DECLARE @runs TABLE (
    runId     INT NOT NULL    
)

-- Parse the XML input into a temporary table
EXEC sp_xml_preparedocument @docHandle OUTPUT, @runsxml

INSERT  @runs        
SELECT  i
FROM OPENXML(@docHandle, N'/runs/r', 0)
    WITH (        
        i INT
    )

-- Done with the document now    
EXEC sp_xml_removedocument @docHandle

-- Return Runs Info
SELECT DISTINCT CategoryName, 
       CounterName
FROM   @runs r
JOIN   LoadTestComputedCounterSummary cat
ON     r.runId = cat.LoadTestRunId
ORDER BY CategoryName,CounterName
GO

GRANT EXECUTE ON prc_QueryPossibleCountersForReport TO PUBLIC
GO

CREATE PROCEDURE [dbo].[Prc_GetInitialDetailRange]
   @LoadTestRunId int,
   @StartTime     DATETIME,
   @EndTime       DATETIME
AS

SET NOCOUNT ON

DECLARE @MinStartTime  DATETIME
DECLARE @MaxEndTime  DATETIME

--First figure out the boundaries
SELECT    @MinStartTime = @StartTime,
          @MaxEndTime = @EndTime


SELECT    @MinStartTime = MIN(TimeStamp),
          @MaxEndTime = MAX(EndTime)
FROM      LoadTestTestDetail
WHERE     LoadTestRunId = @LoadTestRunId
          AND EndTime > @MinStartTime
          AND
          ( 
             (
               TimeStamp >=@MinStartTime 
               AND TimeStamp <@MaxEndTime            
             )
             OR
             (
               TimeStamp < @MinStartTime                           
             )
          )


SELECT @MinStartTime AS MinStartTime,
       @MaxEndTime   AS MaxEndTime
GO

GRANT EXECUTE ON Prc_GetInitialDetailRange TO PUBLIC
GO

CREATE PROCEDURE [dbo].[Prc_GetUniqueDetailIds]
   @LoadTestRunId  INT,
   @DetailType     TINYINT
   
AS

SET NOCOUNT ON


IF (@DetailType = 0) -- Test
BEGIN
    SELECT DISTINCT TestCaseId
    FROM      LoadTestTestDetail detail    
    WHERE     detail.LoadTestRunId = @LoadTestRunId    
END
ELSE IF (@DetailType = 1) --Transaction
BEGIN
    SELECT DISTINCT TestCaseId,t.TransactionId
    FROM      LoadTestTransactionDetail t     	
	JOIN      WebLoadTestTransaction wt
	ON        t.LoadTestRunId = wt.LoadTestRunId
          AND t.TransactionId = wt.TransactionId
    WHERE     t.LoadTestRunId = @LoadTestRunId    
END
ELSE IF (@DetailType = 2) -- Page 
BEGIN
    SELECT DISTINCT TestCaseId,PageId
    FROM      LoadTestPageDetail p         
    JOIN      WebLoadTestRequestMap map
    ON        p.loadtestrunid = map.loadtestrunid
              AND p.PageId = map.RequestId
    WHERE     p.LoadTestRunId = @LoadTestRunId    
END
GO

GRANT EXECUTE ON Prc_GetUniqueDetailIds TO PUBLIC
GO

CREATE PROCEDURE [dbo].[Prc_GetUserTestDetail]
   @LoadTestRunId int,
   @StartTime     DATETIME,
   @EndTime       DATETIME,
   @FilterNoLog   BIT,
   @FilterSuccessfulResults BIT,
   @ItemsXml      NVARCHAR(MAX),
   @ErrorsXml     NVARCHAR(MAX)
AS

SET NOCOUNT ON

DECLARE @docHandle    INT

--parse the items
DECLARE @items TABLE (    
    Test           INT NOT NULL
)

--parse the errors
DECLARE @errors TABLE (
    ErrorId           INT NOT NULL    
)

-- Parse the XML input for items into a temporary table
EXEC sp_xml_preparedocument @docHandle OUTPUT, @ItemsXml

INSERT  @items        
SELECT  t
FROM OPENXML(@docHandle, N'/items/i', 0)
    WITH (                
        t INT
    )

-- Done with the document now    
EXEC sp_xml_removedocument @docHandle

-- Parse the XML input for errors into a temporary table
EXEC sp_xml_preparedocument @docHandle OUTPUT, @ErrorsXml

INSERT  @errors        
SELECT  t
FROM OPENXML(@docHandle, N'/errors/i', 0)
    WITH (                
        t INT        
    )

-- Done with the document now    
EXEC sp_xml_removedocument @docHandle


IF (@FilterSuccessfulResults=0)
BEGIN

--Select all tests active during that time span
SELECT    UserId,
          detail.TestDetailId,
          TestCaseName,
          TimeStamp as StartTime,
          EndTime,
          ScenarioName,
          Outcome,
          detail.AgentId,          
          s.ScenarioId,
          ElapsedTime,
          TestType,
          NetworkName,
          ISNULL(TestLogId,-1) AS TestLogId,
          agent.AgentName
FROM      LoadTestTestDetail detail
JOIN      LoadTestCase tc
ON        detail.LoadTestRunId = tc.LoadTestRunId
          AND detail.TestCaseId = tc.TestCaseId
JOIN      LoadTestScenario s
ON        tc.LoadTestRunId = s.LoadTestRunId
          AND tc.ScenarioId = s.ScenarioId
JOIN      @items i
ON        i.Test = tc.TestCaseId   
JOIN      LoadTestRunAgent AS agent
ON        detail.LoadTestRunId = agent.LoadTestRunId
          AND detail.AgentId = agent.AgentId 
JOIN      LoadTestDetailMessage dm
ON        detail.LoadTestRunId = dm.LoadTestRunId
          AND detail.TestDetailId = dm.TestDetailId
JOIN      LoadTestMessageType mt
ON        mt.LoadTestRunId = dm.LoadTestRunId
          AND  mt.MessageTypeId = dm.MessageTypeId
JOIN      @errors errors
ON        mt.MessageTypeId = errors.ErrorId      
LEFT JOIN LoadTestNetworks n
ON        detail.LoadTestRunId = n.LoadTestRunId
          AND detail.NetworkId = n.NetworkId
WHERE     detail.LoadTestRunId = @LoadTestRunId
          AND EndTime > @StartTime
          AND
          ( 
             (
               TimeStamp >=@StartTime 
               AND TimeStamp <@EndTime            
             )
             OR
             (
               TimeStamp < @StartTime                           
             )
          )
          AND 
          ( 
             (@FilterNoLog = 1 AND TestLogId IS NOT NULL)
             OR
             (@FilterNoLog = 0)
          )

UNION

-- Add the rows for successful outcomes
SELECT    UserId,
          detail.TestDetailId,
          TestCaseName,
          TimeStamp as StartTime,
          EndTime,
          ScenarioName,
          Outcome,
          detail.AgentId,          
          s.ScenarioId,
          ElapsedTime,
          TestType,
          NetworkName,
          ISNULL(TestLogId,-1) AS TestLogId,
          agent.AgentName
FROM      LoadTestTestDetail detail
JOIN      LoadTestCase tc
ON        detail.LoadTestRunId = tc.LoadTestRunId
          AND detail.TestCaseId = tc.TestCaseId
JOIN      LoadTestScenario s
ON        tc.LoadTestRunId = s.LoadTestRunId
          AND tc.ScenarioId = s.ScenarioId
JOIN      @items i
ON        i.Test = tc.TestCaseId   
JOIN      LoadTestRunAgent AS agent
ON        detail.LoadTestRunId = agent.LoadTestRunId
          AND detail.AgentId = agent.AgentId     
LEFT JOIN LoadTestNetworks n
ON        detail.LoadTestRunId = n.LoadTestRunId
          AND detail.NetworkId = n.NetworkId
WHERE     detail.LoadTestRunId = @LoadTestRunId
          AND EndTime > @StartTime
          AND
          ( 
             (
               TimeStamp >=@StartTime 
               AND TimeStamp <@EndTime            
             )
             OR
             (
               TimeStamp < @StartTime                           
             )
          )
          AND 
          ( 
             (@FilterNoLog = 1 AND TestLogId IS NOT NULL)
             OR
             (@FilterNoLog = 0)
          )
          AND
          (
              Outcome = 10
          )
ORDER BY  s.ScenarioId,AgentId,UserId,TestDetailId
END

ELSE

BEGIN
--Select all tests active during that time span
SELECT    UserId,
          detail.TestDetailId,
          TestCaseName,
          TimeStamp as StartTime,
          EndTime,
          ScenarioName,
          Outcome,
          detail.AgentId,          
          s.ScenarioId,
          ElapsedTime,
          TestType,
          NetworkName,
          ISNULL(TestLogId,-1) AS TestLogId,
          agent.AgentName
FROM      LoadTestTestDetail detail
JOIN      LoadTestCase tc
ON        detail.LoadTestRunId = tc.LoadTestRunId
          AND detail.TestCaseId = tc.TestCaseId
JOIN      LoadTestScenario s
ON        tc.LoadTestRunId = s.LoadTestRunId
          AND tc.ScenarioId = s.ScenarioId
JOIN      @items i
ON        i.Test = tc.TestCaseId   
JOIN      LoadTestRunAgent AS agent
ON        detail.LoadTestRunId = agent.LoadTestRunId
          AND detail.AgentId = agent.AgentId 
JOIN      LoadTestDetailMessage dm
ON        detail.LoadTestRunId = dm.LoadTestRunId
          AND detail.TestDetailId = dm.TestDetailId
JOIN      LoadTestMessageType mt
ON        mt.LoadTestRunId = dm.LoadTestRunId
          AND  mt.MessageTypeId = dm.MessageTypeId
JOIN      @errors errors
ON        mt.MessageTypeId = errors.ErrorId      
LEFT JOIN LoadTestNetworks n
ON        detail.LoadTestRunId = n.LoadTestRunId
          AND detail.NetworkId = n.NetworkId
WHERE     detail.LoadTestRunId = @LoadTestRunId
          AND EndTime > @StartTime
          AND
          ( 
             (
               TimeStamp >=@StartTime 
               AND TimeStamp <@EndTime            
             )
             OR
             (
               TimeStamp < @StartTime                           
             )
          )
          AND 
          ( 
             (@FilterNoLog = 1 AND TestLogId IS NOT NULL)
             OR
             (@FilterNoLog = 0)
          )
ORDER BY  s.ScenarioId,AgentId,UserId,TestDetailId
END
GO

GRANT EXECUTE ON Prc_GetUserTestDetail TO PUBLIC
GO

CREATE PROCEDURE [dbo].[Prc_GetUserPageDetail]
    @LoadTestRunId INT,
	@StartTime     DATETIME,
    @EndTime       DATETIME,
    @FilterNoLog   BIT,
    @FilterSuccessfulResults BIT,
    @ItemsXml      NVARCHAR(MAX),
    @ErrorsXml     NVARCHAR(MAX)
AS

SET NOCOUNT ON

DECLARE @docHandle    INT

--parse the items
DECLARE @items TABLE (
    Test           INT NOT NULL,
    Page           INT NOT NULL
)

--parse the errors
DECLARE @errors TABLE (
    ErrorId           INT NOT NULL    
)


-- Parse the XML input for items into a temporary table
EXEC sp_xml_preparedocument @docHandle OUTPUT, @ItemsXml

INSERT  @items        
SELECT  t,p
FROM OPENXML(@docHandle, N'/items/i', 0)
    WITH (                
        t INT,
        p INT
    )

-- Done with the document now    
EXEC sp_xml_removedocument @docHandle


-- Parse the XML input for errors into a temporary table
EXEC sp_xml_preparedocument @docHandle OUTPUT, @ErrorsXml

INSERT  @errors        
SELECT  t
FROM OPENXML(@docHandle, N'/errors/i', 0)
    WITH (                
        t INT        
    )

-- Done with the document now    
EXEC sp_xml_removedocument @docHandle


IF(@FilterSuccessfulResults=0)
BEGIN

--Select all pages active during that time span
SELECT    UserId,
          p.PageDetailId,
          TestCaseName,
          p.TimeStamp as StartTime,
          p.EndTime,
          ScenarioName,
          p.Outcome,
          detail.AgentId,
          s.ScenarioId,
          ResponseTime,
          TestType,
          NetworkName,
          ISNULL(TestLogId,-1),
          PageId,
          RequestUri,
          BrowserName,
          agent.AgentName
FROM      LoadTestPageDetail p     
JOIN      LoadTestTestDetail detail
ON        p.LoadTestRunId = detail.LoadTestRunId
          AND p.TestDetailId= detail.TestDetailId
JOIN      LoadTestCase tc
ON        detail.LoadTestRunId = tc.LoadTestRunId
          AND detail.TestCaseId = tc.TestCaseId
JOIN      LoadTestScenario s
ON        tc.LoadTestRunId = s.LoadTestRunId
          AND tc.ScenarioId = s.ScenarioId
JOIN      LoadTestRunAgent AS agent
ON        detail.LoadTestRunId = agent.LoadTestRunId
          AND detail.AgentId = agent.AgentId              
JOIN      WebLoadTestRequestMap map
ON        p.loadtestrunid = map.loadtestrunid
          AND p.PageId = map.RequestId
JOIN      @items i
ON        i.Test = tc.TestCaseId          
          AND i.Page = map.RequestId
JOIN      LoadTestDetailMessage dm
ON        p.LoadTestRunId = dm.LoadTestRunId
          AND p.TestDetailId = dm.TestDetailId
          AND p.PageDetailId = dm.PageDetailId
JOIN      @errors errors
ON        dm.MessageTypeId = errors.ErrorId                       
LEFT JOIN LoadTestNetworks n
ON        detail.LoadTestRunId = n.LoadTestRunId
          AND detail.NetworkId = n.NetworkId
LEFT JOIN LoadTestBrowsers b
ON        detail.LoadTestRunId = b.LoadTestRunId
          AND detail.BrowserId = b.BrowserId 
WHERE     detail.LoadTestRunId = @LoadTestRunId
          AND p.EndTime > @StartTime
          AND
          ( 
             (
               p.TimeStamp >=@StartTime 
               AND p.TimeStamp <@EndTime            
             )
             OR
             (
               p.TimeStamp < @StartTime                         
             )
          )
          AND ( 
                (@FilterNoLog = 1 AND TestLogId IS NOT NULL)
                OR
                (@FilterNoLog = 0)
              )

UNION

SELECT    UserId,
          PageDetailId,
          TestCaseName,
          p.TimeStamp as StartTime,
          p.EndTime,
          ScenarioName,
          p.Outcome,
          detail.AgentId,
          s.ScenarioId,
          ResponseTime,
          TestType,
          NetworkName,
          ISNULL(TestLogId,-1),
          PageId,
          RequestUri,
          BrowserName,
          agent.AgentName
FROM      LoadTestPageDetail p     
JOIN      LoadTestTestDetail detail
ON        p.LoadTestRunId = detail.LoadTestRunId
          AND p.TestDetailId= detail.TestDetailId
JOIN      LoadTestCase tc
ON        detail.LoadTestRunId = tc.LoadTestRunId
          AND detail.TestCaseId = tc.TestCaseId
JOIN      LoadTestScenario s
ON        tc.LoadTestRunId = s.LoadTestRunId
          AND tc.ScenarioId = s.ScenarioId
JOIN      LoadTestRunAgent AS agent
ON        detail.LoadTestRunId = agent.LoadTestRunId
          AND detail.AgentId = agent.AgentId              
JOIN      WebLoadTestRequestMap map
ON        p.loadtestrunid = map.loadtestrunid
          AND p.PageId = map.RequestId
JOIN      @items i
ON        i.Test = tc.TestCaseId          
          AND i.Page = map.RequestId
LEFT JOIN LoadTestNetworks n
ON        detail.LoadTestRunId = n.LoadTestRunId
          AND detail.NetworkId = n.NetworkId
LEFT JOIN LoadTestBrowsers b
ON        detail.LoadTestRunId = b.LoadTestRunId
          AND detail.BrowserId = b.BrowserId 
WHERE     detail.LoadTestRunId = @LoadTestRunId
          AND p.EndTime > @StartTime
          AND
          ( 
             (
               p.TimeStamp >=@StartTime 
               AND p.TimeStamp <@EndTime            
             )
             OR
             (
               p.TimeStamp < @StartTime                         
             )
          )
          AND ( 
                (@FilterNoLog = 1 AND TestLogId IS NOT NULL)
                OR
                (@FilterNoLog = 0)
              )
          AND
          (
              p.Outcome = 0
          )        
ORDER BY  s.ScenarioId,AgentId,UserId, PageDetailId
END

ELSE
BEGIN

SELECT    UserId,
          p.PageDetailId,
          TestCaseName,
          p.TimeStamp as StartTime,
          p.EndTime,
          ScenarioName,
          p.Outcome,
          detail.AgentId,
          s.ScenarioId,
          ResponseTime,
          TestType,
          NetworkName,
          ISNULL(TestLogId,-1),
          PageId,
          RequestUri,
          BrowserName,
          agent.AgentName
FROM      LoadTestPageDetail p     
JOIN      LoadTestTestDetail detail
ON        p.LoadTestRunId = detail.LoadTestRunId
          AND p.TestDetailId= detail.TestDetailId
JOIN      LoadTestCase tc
ON        detail.LoadTestRunId = tc.LoadTestRunId
          AND detail.TestCaseId = tc.TestCaseId
JOIN      LoadTestScenario s
ON        tc.LoadTestRunId = s.LoadTestRunId
          AND tc.ScenarioId = s.ScenarioId
JOIN      LoadTestRunAgent AS agent
ON        detail.LoadTestRunId = agent.LoadTestRunId
          AND detail.AgentId = agent.AgentId              
JOIN      WebLoadTestRequestMap map
ON        p.loadtestrunid = map.loadtestrunid
          AND p.PageId = map.RequestId
JOIN      @items i
ON        i.Test = tc.TestCaseId          
          AND i.Page = map.RequestId
JOIN      LoadTestDetailMessage dm
ON        p.LoadTestRunId = dm.LoadTestRunId
          AND p.TestDetailId = dm.TestDetailId
          AND p.PageDetailId = dm.PageDetailId
JOIN      @errors errors
ON        dm.MessageTypeId = errors.ErrorId                       
LEFT JOIN LoadTestNetworks n
ON        detail.LoadTestRunId = n.LoadTestRunId
          AND detail.NetworkId = n.NetworkId
LEFT JOIN LoadTestBrowsers b
ON        detail.LoadTestRunId = b.LoadTestRunId
          AND detail.BrowserId = b.BrowserId 
WHERE     detail.LoadTestRunId = @LoadTestRunId
          AND p.EndTime > @StartTime
          AND
          ( 
             (
               p.TimeStamp >=@StartTime 
               AND p.TimeStamp <@EndTime            
             )
             OR
             (
               p.TimeStamp < @StartTime                         
             )
          )
          AND ( 
                (@FilterNoLog = 1 AND TestLogId IS NOT NULL)
                OR
                (@FilterNoLog = 0)
              )      
ORDER BY  s.ScenarioId,AgentId,UserId, PageDetailId
END
GO


GRANT EXECUTE ON Prc_GetUserPageDetail TO PUBLIC
GO

CREATE PROCEDURE [dbo].[Prc_GetUserTransactionDetail]
    @LoadTestRunId INT,
	@StartTime     DATETIME,
    @EndTime       DATETIME,
    @FilterNoLog   BIT,
    @ItemsXml      NVARCHAR(MAX)
AS

SET NOCOUNT ON

DECLARE @docHandle    INT

--parse the items
DECLARE @items TABLE (
    Test            INT NOT NULL,
    TransactionId   INT NOT NULL
)

-- Parse the XML input into a temporary table
EXEC sp_xml_preparedocument @docHandle OUTPUT, @ItemsXml

INSERT  @items        
SELECT  t,tt
FROM OPENXML(@docHandle, N'/items/i', 0)
    WITH (                
        t INT,
        tt INT
    )

-- Done with the document now    
EXEC sp_xml_removedocument @docHandle

--Select all transactions active during that time span
SELECT    UserId,
          TransactionDetailId,
          TestCaseName,          
          t.TimeStamp as StartTime,
          t.EndTime,
          ScenarioName,          
          detail.AgentId,
          s.ScenarioId,
          t.ElapsedTime,
          TestType,
          NetworkName,
          ISNULL(TestLogId,-1),
          t.TransactionId,
          wt.TransactionName,
          agent.AgentName
FROM      LoadTestTransactionDetail t     
JOIN      LoadTestTestDetail detail
ON        t.LoadTestRunId = detail.LoadTestRunId
          AND t.TestDetailId= detail.TestDetailId
JOIN      LoadTestCase tc
ON        detail.LoadTestRunId = tc.LoadTestRunId
          AND detail.TestCaseId = tc.TestCaseId
JOIN      LoadTestScenario s
ON        tc.LoadTestRunId = s.LoadTestRunId
          AND tc.ScenarioId = s.ScenarioId
JOIN      LoadTestRunAgent AS agent
ON        detail.LoadTestRunId = agent.LoadTestRunId
          AND detail.AgentId = agent.AgentId     
JOIN      WebLoadTestTransaction wt
ON        t.LoadTestRunId = wt.LoadTestRunId
          AND t.TransactionId = wt.TransactionId
JOIN      @items i
ON        i.Test = tc.TestCaseId          
          AND i.TransactionId = wt.TransactionId
LEFT JOIN LoadTestNetworks n
ON        detail.LoadTestRunId = n.LoadTestRunId
          AND detail.NetworkId = n.NetworkId
LEFT JOIN LoadTestBrowsers b
ON        detail.LoadTestRunId = b.LoadTestRunId
          AND detail.BrowserId = b.BrowserId 
WHERE     detail.LoadTestRunId = @LoadTestRunId
          AND t.EndTime > @StartTime
          AND
          ( 
             (
               t.TimeStamp >=@StartTime 
               AND t.TimeStamp <@EndTime            
             )
             OR
             (
               t.TimeStamp < @StartTime                         
             )
          )
          AND ( 
                (@FilterNoLog = 1 AND TestLogId IS NOT NULL)
                OR
                (@FilterNoLog = 0)
              )
ORDER BY  s.ScenarioId,AgentId,UserId, TransactionDetailId
GO

GRANT EXECUTE ON Prc_GetUserTransactionDetail TO PUBLIC
GO


CREATE PROCEDURE [dbo].[Prc_GetAvailableDetailTypes]
    @LoadTestRunId INT	
AS

SET NOCOUNT ON

DECLARE @TestDetailExists  BIT
DECLARE @PageDetailExists  BIT
DECLARE @TransactionDetailExists  BIT

SET @TestDetailExists = 0
SET @PageDetailExists = 0
SET @TransactionDetailExists = 0

IF EXISTS 
(
    SELECT TOP 1 LoadTestRunId
    FROM   LoadTestPageDetail
    WHERE  LoadTestRunId = @LoadTestRunId
)
BEGIN
    SET @PageDetailExists = 1
END

IF EXISTS 
(
    SELECT TOP 1 LoadTestRunId
    FROM   LoadTestTransactionDetail
    WHERE  LoadTestRunId = @LoadTestRunId
)
BEGIN
    SET @TransactionDetailExists = 1
END

IF EXISTS 
(
    SELECT TOP 1 LoadTestRunId
    FROM   LoadTestTestDetail
    WHERE  LoadTestRunId = @LoadTestRunId
)
BEGIN
    SET @TestDetailExists = 1
END

SELECT @TestDetailExists AS TestDetailsExists,
       @PageDetailExists AS PageDetailExists, 
       @TransactionDetailExists AS TransactionDetailExists
GO
GRANT EXECUTE ON Prc_GetAvailableDetailTypes TO PUBLIC
GO

CREATE VIEW [dbo].[LoadTestRequestSummary] AS
SELECT run.LoadTestName, 
       category.LoadTestRunId, 
       counter.CounterName,
       ISNULL(scenario.ScenarioName,'_Total') as ScenarioName,
       ISNULL(testcase.TestCaseName,'_Total') as TestCaseName, 
       ISNULL(request.RequestUri,'_Total') as RequestUri, 
    instance.CumulativeValue
FROM       LoadTestRun AS run
INNER JOIN LoadTestPerformanceCounterCategory AS category 
    ON run.LoadTestRunId = category.LoadTestRunId
INNER JOIN LoadTestPerformanceCounter AS counter 
    ON category.LoadTestRunId = counter.LoadTestRunId
    AND category.CounterCategoryId = counter.CounterCategoryId
INNER JOIN LoadTestPerformanceCounterInstance AS instance 
    ON counter.CounterId = instance.CounterId
    AND counter.LoadTestRunId = instance.LoadTestRunId
LEFT JOIN WebLoadTestRequestMap AS request
    ON request.LoadTestRunId = instance.LoadTestRunId
    AND request.RequestId = instance.LoadTestItemId
LEFT JOIN LoadTestCase As testcase
    ON request.LoadTestRunId = testcase.LoadTestRunId
    AND request.TestCaseId = testcase.TestCaseId
LEFT JOIN LoadTestScenario As scenario
    ON testcase.LoadTestRunId = scenario.LoadTestRunId
    AND testcase.ScenarioId = scenario.ScenarioId
WHERE category.CategoryName = 'LoadTest:Request' and instance.CumulativeValue IS NOT NULL

GO
GRANT SELECT ON [dbo].[LoadTestRequestSummary] TO PUBLIC
GO

CREATE VIEW [dbo].[LoadTestScenarioSummary] AS
SELECT run.LoadTestName AS LoadTestName, 
       category.LoadTestRunId AS LoadTestRunId, 
       counter.CounterName AS CounterName,
       CASE instance.InstanceName WHEN '_Total' THEN '_Total' ELSE scenario.ScenarioName END AS ScenarioName,         
       instance.CumulativeValue AS CumulativeValue
FROM       LoadTestRun AS run
INNER JOIN LoadTestScenario As scenario
    ON run.LoadTestRunId = scenario.LoadTestRunId    
INNER JOIN LoadTestPerformanceCounterCategory AS category 
    ON scenario.LoadTestRunId = category.LoadTestRunId
INNER JOIN LoadTestPerformanceCounter AS counter 
    ON category.LoadTestRunId = counter.LoadTestRunId
    AND category.CounterCategoryId = counter.CounterCategoryId
INNER JOIN LoadTestPerformanceCounterInstance AS instance 
    ON counter.CounterId = instance.CounterId
    AND counter.LoadTestRunId = instance.LoadTestRunId
    AND (instance.InstanceName = scenario.ScenarioName OR instance.InstanceName = '_Total')
WHERE category.CategoryName = 'LoadTest:Scenario' 
      AND instance.CumulativeValue IS NOT NULL
GROUP BY LoadTestName, category.LoadTestRunId, CounterName,CASE instance.InstanceName WHEN '_Total' THEN '_Total' ELSE scenario.ScenarioName END,CumulativeValue
      
GO
GRANT SELECT ON [dbo].[LoadTestScenarioSummary] TO PUBLIC
GO

CREATE PROCEDURE Prc_QueryComputedCounterSummary
	@ReportId     INT,
	@CounterName  NVARCHAR(255),
    @CategoryName  NVARCHAR(255)	
AS
SELECT LoadTestName,
       a.LoadTestRunId as LoadTestRunId,
       MachineName,
       CategoryName,
       CounterName,       
       InstanceName,             
       CumulativeValue
FROM  LoadTestComputedCounterSummary a
JOIN  LoadTestReportRuns b
ON    a.LoadTestRunId = B.LoadTestRunId
WHERE b.ReportId = @ReportId
      AND CategoryName = @CategoryName
      AND CounterName = @CounterName      
ORDER BY a.LoadTestRunId
GO

GRANT EXECUTE ON Prc_QueryComputedCounterSummary TO PUBLIC
GO

CREATE PROCEDURE Prc_QueryLoadTestPageSummary
	@ReportId     INT,
	@CounterName  NVARCHAR(255)	
AS
SELECT LoadTestName,
       a.LoadTestRunId as LoadTestRunId,
       CounterName,
       ScenarioName,
       TestCaseName, 
       RequestUri,      
       Cumulativevalue
FROM  LoadTestPageSummary a
JOIN  LoadTestReportRuns b
ON    a.LoadTestRunId = B.LoadTestRunId
WHERE b.ReportId = @ReportId
      AND CounterName = @CounterName      
ORDER BY a.LoadTestRunId
GO

GRANT EXECUTE ON Prc_QueryLoadTestPageSummary TO PUBLIC
GO

CREATE PROCEDURE Prc_QueryLoadTestTestCaseSummary
	@ReportId     INT,
	@CounterName  NVARCHAR(255)	
AS
SELECT LoadTestName,
       a.LoadTestRunId as LoadTestRunId,
       CounterName,
       ScenarioName,
       TestCaseName,       
       Cumulativevalue
FROM  LoadTestTestCaseSummary a
JOIN  LoadTestReportRuns b
ON    a.LoadTestRunId = B.LoadTestRunId
WHERE b.ReportId = @ReportId
      AND CounterName = @CounterName      
ORDER BY a.LoadTestRunId
GO

GRANT EXECUTE ON Prc_QueryLoadTestTestCaseSummary TO PUBLIC
GO

CREATE PROCEDURE Prc_QueryLoadTestTransactionSummary
	@ReportId     INT,
	@CounterName  NVARCHAR(255)	
AS
SELECT LoadTestName,
       a.LoadTestRunId as LoadTestRunId,
       CounterName,
       ScenarioName,
       TestCaseName,
       TransactionName,
       Cumulativevalue
FROM  LoadTestTransactionSummary a
JOIN  LoadTestReportRuns b
ON    a.LoadTestRunId = B.LoadTestRunId
WHERE b.ReportId = @ReportId
      AND CounterName = @CounterName      
ORDER BY a.LoadTestRunId
GO

GRANT EXECUTE ON Prc_QueryLoadTestTransactionSummary TO PUBLIC
GO

CREATE PROCEDURE Prc_QueryLoadTestRequestSummary
	@ReportId     INT,
	@CounterName  NVARCHAR(255)	
AS
SELECT LoadTestName,
       a.LoadTestRunId as LoadTestRunId,
       CounterName,
       ScenarioName,
       TestCaseName,
       RequestUri,
       Cumulativevalue
FROM  LoadTestRequestSummary a
JOIN  LoadTestReportRuns b
ON    a.LoadTestRunId = B.LoadTestRunId
WHERE b.ReportId = @ReportId
      AND CounterName = @CounterName      
ORDER BY a.LoadTestRunId
GO

GRANT EXECUTE ON Prc_QueryLoadTestRequestSummary TO PUBLIC
GO

CREATE PROCEDURE Prc_QueryLoadTestScenarioSummary
	@ReportId     INT,
	@CounterName  NVARCHAR(255)	
AS
SELECT LoadTestName,
       a.LoadTestRunId,
       CounterName,
       ScenarioName,
       CumulativeValue
FROM  LoadTestScenarioSummary a
JOIN  LoadTestReportRuns b
ON    a.LoadTestRunId = B.LoadTestRunId
WHERE b.ReportId = @ReportId
      AND CounterName = @CounterName      
ORDER BY a.LoadTestRunId
GO

GRANT EXECUTE ON Prc_QueryLoadTestScenarioSummary TO PUBLIC
GO


UPDATE LoadTestRun SET LoadTestSchemaRev = 1
GO

CREATE PROCEDURE Prc_UpdateTestSummary @LoadTestRunId int, @TestCaseId int
AS
UPDATE LoadTestTestSummaryData set 

    Percentile90 =
        (SELECT MIN(ElapsedTime) 
         FROM 
        (SELECT TOP 10 percent ElapsedTime FROM LoadTestTestDetail 
         WHERE LoadTestRunId = @LoadTestRunId 
              AND TestCaseId=@TestCaseId
              AND InMeasurementInterval = 1
         ORDER BY ElapsedTime desc) AS TopElapsedTimes),

    Percentile95 =
        (SELECT MIN(ElapsedTime) 
         FROM 
        (SELECT TOP 5 percent ElapsedTime FROM LoadTestTestDetail 
         WHERE LoadTestRunId = @LoadTestRunId 
                  AND TestCaseId=@TestCaseId
                  AND InMeasurementInterval = 1
         ORDER BY ElapsedTime DESC) AS TopElapsedTimes),

    Percentile99 =
        (SELECT MIN(ElapsedTime) 
         FROM 
        (SELECT TOP 1 percent ElapsedTime FROM LoadTestTestDetail 
         WHERE LoadTestRunId = @LoadTestRunId 
                  AND TestCaseId=@TestCaseId
                  AND InMeasurementInterval = 1
         ORDER BY ElapsedTime DESC) AS TopElapsedTimes),

    Median =
        (SELECT MIN(ElapsedTime)
         FROM
        (SELECT TOP 50 PERCENT ElapsedTime FROM LoadTestTestDetail
         WHERE LoadTestRunId = @LoadTestRunId 
                  AND TestCaseId=@TestCaseId
                  AND InMeasurementInterval = 1
         ORDER BY ElapsedTime DESC) AS TopElapsedTimes)

    WHERE LoadTestRunId = @LoadTestRunId 
      AND TestCaseId=@TestCaseId
GO
GRANT EXECUTE ON Prc_UpdateTestSummary TO PUBLIC
GO


CREATE PROCEDURE Prc_UpdateTransactionSummary @LoadTestRunId int, @TransactionId int
AS
UPDATE LoadTestTransactionSummaryData 
SET 
    Percentile90 =
    (SELECT MIN(ResponseTime) 
     FROM 
         (SELECT TOP 10 percent ResponseTime 
          FROM LoadTestTransactionDetail 
          WHERE LoadTestRunId = @LoadTestRunId 
                AND TransactionId=@TransactionId
                AND InMeasurementInterval = 1
          ORDER BY ResponseTime desc) as TopResponseTimes),

    Percentile95 =
    (SELECT MIN(ResponseTime) 
     FROM 
         (SELECT TOP 5 percent ResponseTime 
          FROM   LoadTestTransactionDetail 
          WHERE  LoadTestRunId = @LoadTestRunId 
                 AND TransactionId=@TransactionId
                 AND InMeasurementInterval = 1
          ORDER BY ResponseTime desc) AS TopResponseTimes),

    Percentile99 =
    (SELECT MIN(ResponseTime) 
     FROM 
         (SELECT TOP 1 percent ResponseTime 
          FROM   LoadTestTransactionDetail 
          WHERE  LoadTestRunId = @LoadTestRunId 
                 AND TransactionId=@TransactionId
                 AND InMeasurementInterval = 1
          ORDER BY ResponseTime desc) AS TopResponseTimes),

    Median =
        (SELECT MIN(ResponseTime)
         FROM
        (SELECT TOP 50 PERCENT ResponseTime FROM LoadTestTransactionDetail
         WHERE LoadTestRunId = @LoadTestRunId 
                  AND TransactionId=@TransactionId
                  AND InMeasurementInterval = 1
         ORDER BY ResponseTime DESC) AS TopResponseTimes)    

WHERE LoadTestRunId = @LoadTestRunId 
      AND TransactionId=@TransactionId
GO
GRANT EXECUTE ON Prc_UpdateTransactionSummary TO PUBLIC
GO

CREATE PROCEDURE Prc_UpdatePageSummary @LoadTestRunId int, @PageId int
AS
UPDATE LoadTestPageSummaryData 
SET 
    Percentile90 =
      (SELECT MIN(ResponseTime) 
       FROM 
           (SELECT TOP 10 PERCENT ResponseTime 
            FROM LoadTestPageDetail 
            WHERE LoadTestRunId = @LoadTestRunId 
                  AND PageId=@PageId
                  AND InMeasurementInterval = 1
            ORDER BY ResponseTime DESC) AS TopResponseTimes),

    Percentile95 =
       (SELECT MIN(ResponseTime) 
        FROM 
            (SELECT TOP 5 percent ResponseTime 
             FROM LoadTestPageDetail 
             WHERE LoadTestRunId = @LoadTestRunId 
                   AND PageId=@PageId
                   AND InMeasurementInterval = 1
             ORDER BY ResponseTime DESC) AS TopResponseTimes),

    Percentile99 =
       (SELECT MIN(ResponseTime) 
        FROM 
            (SELECT TOP 1 percent ResponseTime 
             FROM LoadTestPageDetail 
             WHERE LoadTestRunId = @LoadTestRunId 
                   AND PageId=@PageId
                   AND InMeasurementInterval = 1
             ORDER BY ResponseTime DESC) AS TopResponseTimes),

    Median =
        (SELECT MIN(ResponseTime) FROM 
        (SELECT TOP 50 PERCENT ResponseTime FROM LoadTestPageDetail
         WHERE LoadTestRunId = @LoadTestRunId 
                  AND PageId=@PageId
                  AND InMeasurementInterval = 1
         ORDER BY ResponseTime DESC) AS TopResponseTimes)

WHERE LoadTestRunId = @LoadTestRunId 
      AND PageId=@PageId
GO
GRANT EXECUTE ON Prc_UpdatePageSummary TO PUBLIC
GO


CREATE PROCEDURE Prc_UpdatePageSummaryByNetwork @LoadTestRunId int, @PageId int, @NetworkId int
AS
UPDATE LoadTestPageSummaryByNetwork 
SET 
    Percentile90 =
    (SELECT MIN(ResponseTime) 
     FROM 
         (SELECT TOP 10 percent pageDetail.ResponseTime 
          FROM LoadTestPageDetail AS pageDetail
          JOIN LoadTestTestDetail AS testDetail
          ON   pageDetail.LoadTestRunId = testDetail.LoadTestRunId
               AND pageDetail.TestDetailId = testDetail.TestDetailId
          where pageDetail.LoadTestRunId = @LoadTestRunId 
                AND pageDetail.PageId=@PageId 
                AND testDetail.NetworkId=@NetworkId
                AND pageDetail.InMeasurementInterval = 1
          ORDER BY pageDetail.ResponseTime DESC) AS TopResponseTimes),

    Percentile95 =
    (SELECT MIN(ResponseTime) 
     FROM 
         (SELECT TOP 5 percent pageDetail.ResponseTime 
          FROM LoadTestPageDetail AS pageDetail
          JOIN LoadTestTestDetail AS testDetail
               ON   pageDetail.LoadTestRunId = testDetail.LoadTestRunId
               AND pageDetail.TestDetailId = testDetail.TestDetailId
          WHERE pageDetail.LoadTestRunId = @LoadTestRunId 
                AND pageDetail.PageId=@PageId 
                AND testDetail.NetworkId=@NetworkId
                AND pageDetail.InMeasurementInterval = 1
          ORDER BY pageDetail.ResponseTime DESC) AS TopResponseTimes),

    Percentile99 =
    (SELECT MIN(ResponseTime) 
     FROM 
         (SELECT TOP 1 percent pageDetail.ResponseTime 
          FROM LoadTestPageDetail AS pageDetail
          JOIN LoadTestTestDetail AS testDetail
               ON   pageDetail.LoadTestRunId = testDetail.LoadTestRunId
               AND pageDetail.TestDetailId = testDetail.TestDetailId
          WHERE pageDetail.LoadTestRunId = @LoadTestRunId 
                AND pageDetail.PageId=@PageId 
                AND testDetail.NetworkId=@NetworkId
                AND pageDetail.InMeasurementInterval = 1
          ORDER BY pageDetail.ResponseTime DESC) AS TopResponseTimes),

    Median =
    (SELECT MIN(ResponseTime) 
     FROM 
         (SELECT TOP 50 percent pageDetail.ResponseTime 
          FROM LoadTestPageDetail AS pageDetail
          JOIN LoadTestTestDetail AS testDetail
               ON  pageDetail.LoadTestRunId = testDetail.LoadTestRunId
               AND pageDetail.TestDetailId = testDetail.TestDetailId
          WHERE pageDetail.LoadTestRunId = @LoadTestRunId 
                AND pageDetail.PageId=@PageId 
                AND testDetail.NetworkId=@NetworkId
                AND pageDetail.InMeasurementInterval = 1
          ORDER BY pageDetail.ResponseTime DESC) AS TopResponseTimes),

    PagesMeetingGoal =
       (SELECT count(*)
        FROM LoadTestPageDetail AS pageDetail
        JOIN LoadTestTestDetail AS testDetail
        ON   pageDetail.LoadTestRunId = testDetail.LoadTestRunId
             AND pageDetail.TestDetailId = testDetail.TestDetailId
        WHERE pageDetail.LoadTestRunId = @LoadTestRunId  
              AND pageDetail.PageId=@PageId 
              AND testDetail.NetworkId=@NetworkId 
              AND pageDetail.GoalExceeded = 0
              AND pageDetail.InMeasurementInterval = 1)

WHERE LoadTestRunId=@LoadTestRunId
      AND PageId=@PageId
      AND NetworkId=@NetworkId
GO
GRANT EXECUTE ON Prc_UpdatePageSummaryByNetwork TO PUBLIC
GO

CREATE PROCEDURE Prc_UpdateSummaryData2 @LoadTestRunId int, @DeleteDetailTables bit
AS
BEGIN
	INSERT INTO LoadTestTestSummaryData 
	    (LoadTestRunId, TestCaseId, TestsRun, Average, Minimum, Maximum, StandardDeviation)
	   SELECT LoadTestRunId, TestCaseId,
                  count(*) as TestsRun,
                  avg(ElapsedTime) as Average, 
                  min(ElapsedTime) as Minimum,
                  max(ElapsedTime) as Maximum,
                  ISNULL(STDEVP(ElapsedTime),0) AS StandardDeviation
	    FROM  LoadTestTestDetail 
		WHERE LoadTestRunId=@LoadTestRunId
		      AND InMeasurementInterval = 1
	    GROUP BY LoadTestRunId, TestCaseId

	DECLARE @TestCaseId int

	DECLARE TestCaseCursor CURSOR FOR
	SELECT DISTINCT(TestCaseId) FROM LoadTestTestDetail WHERE LoadTestRunId = @LoadTestRunId

	OPEN TestCaseCursor
	FETCH NEXT FROM TestCaseCursor INTO @TestCaseId

	WHILE @@FETCH_STATUS = 0
	BEGIN
	   EXEC Prc_UpdateTestSummary @LoadTestRunId, @TestCaseId
	   FETCH NEXT FROM TestCaseCursor INTO @TestCaseId
	END

	CLOSE TestCaseCursor
	DEALLOCATE TestCaseCursor

	INSERT INTO LoadTestTransactionSummaryData 
	    (LoadTestRunId, TransactionId, TransactionCount, Average, Minimum, Maximum,AvgTransactionTime, StandardDeviation)
	    SELECT LoadTestRunId, TransactionId,
               count(*) as TransactionCount,
               avg(ResponseTime) as Average, 
               min(ResponseTime) as Minimum,
               max(ResponseTime) as Maximum,
               avg(ElapsedTime) as AverageTransactionTime,
               ISNULL(STDEVP(ResponseTime),0) AS StandardDeviation
	    FROM LoadTestTransactionDetail 
		WHERE  LoadTestRunId=@LoadTestRunId
		       AND InMeasurementInterval = 1
	    GROUP BY LoadTestRunId, TransactionId

	DECLARE @TransactionId int

	DECLARE TransactionIdCursor CURSOR FOR
	SELECT DISTINCT(TransactionId) FROM LoadTestTransactionDetail WHERE LoadTestRunId = @LoadTestRunId

	OPEN TransactionIdCursor
	FETCH NEXT FROM TransactionIdCursor INTO @TransactionId

	WHILE @@FETCH_STATUS = 0
	BEGIN
	   EXEC Prc_UpdateTransactionSummary @LoadTestRunId, @TransactionId
	   FETCH NEXT FROM TransactionIdCursor INTO @TransactionId
	END

	CLOSE TransactionIdCursor
	DEALLOCATE TransactionIdCursor

	INSERT INTO LoadTestPageSummaryData 
	    (LoadTestRunId, PageId, PageCount, Average, Minimum, Maximum, StandardDeviation)
	    SELECT LoadTestRunId, PageId,
               count(*) as PageCount,
               avg(ResponseTime) as Average, 
               min(ResponseTime) as Minimum,
               max(ResponseTime) as Maximum,
               ISNULL(STDEVP(ResponseTime),0) AS StandardDeviation
	    FROM   LoadTestPageDetail 
		WHERE  LoadTestRunId=@LoadTestRunId
		       AND InMeasurementInterval = 1
	    GROUP BY LoadTestRunId, PageId

	DECLARE @PageId int

	DECLARE PageIdCursor CURSOR FOR
	SELECT DISTINCT(PageId) FROM LoadTestPageDetail WHERE LoadTestRunId = @LoadTestRunId

	OPEN PageIdCursor
	FETCH NEXT FROM PageIdCursor INTO @PageId

	WHILE @@FETCH_STATUS = 0
	BEGIN
	   EXEC Prc_UpdatePageSummary @LoadTestRunId, @PageId
	   FETCH NEXT FROM PageIdCursor INTO @PageId
	END

	CLOSE PageIdCursor
	DEALLOCATE PageIdCursor

	INSERT INTO LoadTestPageSummaryByNetwork
	    (LoadTestRunId, PageId, NetworkId, PageCount, Average, Minimum, Maximum, Goal, StandardDeviation)
	    SELECT pageDetail.LoadTestRunId, pageDetail.PageId, testDetail.NetworkId,
               count(*) as PageCount,
               avg(ResponseTime) as Average, 
               min(ResponseTime) as Minimum,
               max(ResponseTime) as Maximum,
               avg(ResponseTimeGoal) as Goal,
               ISNULL(STDEVP(ResponseTime),0) AS StandardDeviation
	    FROM   LoadTestPageDetail as pageDetail
	    INNER JOIN LoadTestTestDetail as testDetail
	    ON pageDetail.LoadTestRunId = testDetail.LoadTestRunId
	          AND pageDetail.TestDetailId = testDetail.TestDetailId
	    WHERE pageDetail.LoadTestRunId = @LoadTestRunId
		      AND pageDetail.InMeasurementInterval = 1
	    GROUP BY pageDetail.LoadTestRunId, PageId, testDetail.NetworkId

	DECLARE @NetworkId int

	DECLARE PageNetworkCursor CURSOR FOR
	SELECT PageId, NetworkId from LoadTestPageSummaryByNetwork WHERE LoadTestRunId = @LoadTestRunId

	OPEN PageNetworkCursor
	FETCH NEXT FROM PageNetworkCursor INTO @PageId, @NetworkId

	WHILE @@FETCH_STATUS = 0
	BEGIN
	   EXEC Prc_UpdatePageSummaryByNetwork @LoadTestRunId, @PageId, @NetworkId
	   FETCH NEXT FROM PageNetworkCursor INTO @PageId, @NetworkId
	END

	CLOSE PageNetworkCursor
	DEALLOCATE PageNetworkCursor

	IF @DeleteDetailTables = 1
	BEGIN
		DELETE from LoadTestTestDetail where LoadTestRunId = @LoadTestRunId
		DELETE from LoadTestTransactionDetail where LoadTestRunId = @LoadTestRunId
		DELETE from LoadTestPageDetail where LoadTestRunId = @LoadTestRunId
	END
END
GO
GRANT EXECUTE ON Prc_UpdateSummaryData2 TO PUBLIC
GO

CREATE PROCEDURE [dbo].[Prc_QueryLoadTestPageComparison]
    @Baseline      INT,
    @ComparisonRun INT
AS

SELECT run1.ScenarioName,
       run1.TestCaseName,
       run1.RequestUri,
       run1.CumulativeValue AS Baseline,
       run2.CumulativeValue AS ComparisonRun,
       run2.ResponseTimeGoal
FROM   LoadTestPageSummary run1
LEFT JOIN   (SELECT * 
             FROM LoadTestPageSummary 
             WHERE LoadTestRunId =@ComparisonRun )run2     
ON     run1.ScenarioName = run2.ScenarioName
       AND  run1.TestCaseName = run2.TestCaseName
       AND  run1.RequestUri = run2.RequestUri
       AND  run1.CounterName = run2.CounterName 
WHERE  run1.LoadTestRunId = @Baseline       
       AND run1.CounterName = 'Avg. Page Time'   
       AND run1.TestCaseName != '_Total'

GRANT EXECUTE ON Prc_QueryLoadTestPageComparison TO PUBLIC
GO

CREATE PROCEDURE [dbo].[Prc_QueryLoadTestTestComparison]
    @Baseline      INT,
    @ComparisonRun INT
AS

SELECT run1.ScenarioName,
       run1.TestCaseName,       
       run1.CumulativeValue AS Baseline,
       run2.CumulativeValue AS ComparisonRun
FROM   LoadTestTestCaseSummary run1
LEFT JOIN   (SELECT * 
             FROM LoadTestTestCaseSummary 
             WHERE LoadTestRunId = @ComparisonRun) run2
ON     run1.ScenarioName = run2.ScenarioName
       AND  run1.TestCaseName = run2.TestCaseName  
       AND  run1.CounterName = run2.CounterName     
WHERE  run1.LoadTestRunId = @Baseline       
       AND run1.CounterName = 'Avg. Test Time'   
       AND run1.TestCaseName != '_Total'    
       
GO

GRANT EXECUTE ON Prc_QueryLoadTestTestComparison TO PUBLIC
GO

CREATE PROCEDURE [dbo].[Prc_QueryLoadTestTransactionComparison]
    @Baseline      INT,
    @ComparisonRun INT
AS

SELECT run1.ScenarioName,
       run1.TestCaseName,  
       run1.TransactionName,     
       run1.CumulativeValue AS Baseline,
       run2.CumulativeValue AS ComparisonRun
FROM   LoadTestTransactionSummary run1
LEFT JOIN   (SELECT * 
             FROM LoadTestTransactionSummary 
             WHERE LoadTestRunId = @ComparisonRun) run2 
ON     run1.ScenarioName = run2.ScenarioName
       AND  run1.TestCaseName = run2.TestCaseName 
       AND  run1.TransactionName = run2.TransactionName 
       AND  run1.CounterName = run2.CounterName     
WHERE  run1.LoadTestRunId = @Baseline       
       AND run1.CounterName = 'Avg. Response Time'  
       AND run1.TransactionName != '_Total'      
       

GO

GRANT EXECUTE ON Prc_QueryLoadTestTransactionComparison TO PUBLIC
GO

CREATE PROCEDURE [dbo].[Prc_QueryComputedCounterComparison]
    @ReportId      INT,
    @Baseline      INT,
    @ComparisonRun INT
AS


SELECT run.LoadTestRunId AS LoadTestRunId,
       run.MachineName AS MachineName,       
       run.CategoryName AS CategoryName,
       run.CounterName AS CounterName,
       run.HigherIsBetter AS HigherIsBetter,
       run.InstanceName AS InstanceName,
       run.CumulativeValue AS CumulativeValue              
FROM   LoadTestReportPage report
JOIN   LoadTestComputedCounterSummary run
ON     report.CategoryName = run.CategoryName
       AND report.CounterName = run.CounterName     
WHERE  report.ReportId = @ReportId
       AND run.LoadTestRunId in( @Baseline,@ComparisonRun)
       AND (run.CategoryName NOT LIKE 'LoadTest:%'
            OR (run.CategoryName LIKE 'LoadTest:%' AND run.InstanceName = '_Total'))
ORDER BY LoadTestRunId, MachineName, CategoryName, CounterName, InstanceName
GO

GRANT EXECUTE ON Prc_QueryComputedCounterComparison TO PUBLIC
GO

CREATE PROCEDURE [dbo].[prc_QueryForMachinesInRun]    
    @Baseline      INT,
    @ComparisonRun INT
AS
SET NOCOUNT ON


SELECT LoadTestRunId   AS LoadTestRunId,
       ControllerName  AS Machine,
       'Controller'    AS MachineRole
FROM   LoadTestRun
WHERE  LoadTestRunId in (@Baseline,@ComparisonRun)
UNION  
SELECT LoadTestRunId   AS LoadTestRunId,
       AgentName       AS Machine,
       'Agent'         AS MachineRole
FROM   LoadTestRunAgent       
WHERE  LoadTestRunId in (@Baseline,@ComparisonRun)
UNION  
SELECT SUT.LoadTestRunId AS LoadTestRunId,
       MachineName       AS Machine,
       MachineTag        AS MachineRole
FROM   LoadTestSystemUnderTest AS SUT
LEFT JOIN   LoadTestSystemUnderTestTag AS Tags
ON     SUT.LoadTestRunId = Tags.LoadTestRunId
       AND SUT.SystemUnderTestId = Tags.SystemUnderTestId 
WHERE  SUT.LoadTestRunId in (@Baseline,@ComparisonRun)
UNION  
SELECT DISTINCT LoadTestRunId   AS LoadTestRunId,
       MachineName              AS Machine,
       NULL                     AS MachineRole
FROM   LoadTestPerformanceCounterCategory    
WHERE  LoadTestRunId in (@Baseline,@ComparisonRun) 
ORDER BY LoadTestRunId, Machine,MachineRole
GO

GRANT EXECUTE ON [prc_QueryForMachinesInRun] TO PUBLIC
GO


CREATE PROCEDURE [dbo].[Prc_QueryLoadTestErrorComparison]
    @Baseline      INT,
    @ComparisonRun INT
AS

DECLARE @errors TABLE (
    LoadTestRunId  INT NOT NULL,
    ErrorType      TINYINT NOT NULL,
    SubType        NVARCHAR(64),
    ErrorCount     INT NOT NULL      
)

--get baseline errors
INSERT INTO @errors
SELECT DISTINCT @Baseline, MessageType, SubType, COUNT(*) as Count
FROM LoadTestMessage
WHERE LoadTestRunId = @Baseline
GROUP BY MessageType, SubType

--get comparison errors
INSERT INTO @errors
SELECT DISTINCT @ComparisonRun, MessageType, SubType, COUNT(*) as Count
FROM LoadTestMessage
WHERE LoadTestRunId = @ComparisonRun
GROUP BY MessageType, SubType

--top select gets errors that both runs have and ones that only run1 have
--bottom select gets errors that are only in the comparison run
SELECT run1.ErrorType,
       run1.SubType,       
       run1.ErrorCount AS Baseline,
       run2.ErrorCount AS ComparisonRun       
FROM   @errors run1
LEFT JOIN   (SELECT * FROM @errors WHERE LoadTestRunId = @ComparisonRun) run2
ON     run1.ErrorType = run2.ErrorType
       AND  run1.SubType = run2.SubType       
WHERE  run1.LoadTestRunId = @Baseline  
UNION   
SELECT run2.ErrorType,
       run2.SubType,       
       run1.ErrorCount AS Baseline,
       run2.ErrorCount AS ComparisonRun       
FROM   @errors run2
LEFT JOIN   (SELECT * FROM @errors WHERE LoadTestRunId = @Baseline) run1
ON     run1.ErrorType = run2.ErrorType
       AND  run1.SubType = run2.SubType       
WHERE  run2.LoadTestRunId = @ComparisonRun  
       AND  run1.ErrorType IS NULL
ORDER BY ErrorType, SubType
GO

GRANT EXECUTE ON Prc_QueryLoadTestErrorComparison TO PUBLIC
GO


CREATE PROCEDURE Prc_GetRequestMap2 @LoadTestRunId int
AS
SELECT 
RequestId,
TestCaseId,
RequestUri,
ResponseTimeGoal
FROM WebLoadTestRequestMap
WHERE LoadTestRunId = @LoadTestRunId
ORDER BY RequestId
GO

GRANT EXECUTE ON Prc_GetRequestMap2 TO PUBLIC
GO

--Create default Load Test Reports
INSERT INTO LoadTestReport
SELECT 'LOADTEST_RUNCOMPARISON_REPORT_DEFAULT', -- Report Name
       NULL,                                    -- Description
       'LOADTEST_RUNCOMPARISON_REPORT_DEFAULT', -- LoadTest
       -1,                                      -- LastRunId
       1,                                       -- SelectNewRuns
       GetUtcDate(),                            -- LastModified
       '',                                      -- User
       2                                        -- ReportType
       
DECLARE @ReportId INT
SELECT @ReportId = MAX(ReportId) FROM  LoadTestReport

INSERT INTO LoadTestReportPage
SELECT @ReportId,
       'Memory',
       'Available MBytes'
       
INSERT INTO LoadTestReportPage
SELECT @ReportId,
       'Network Interface',
       'Bytes Total/sec'
       
INSERT INTO LoadTestReportPage
SELECT @ReportId,
       'PhysicalDisk',
       '% Idle Time'
       
INSERT INTO LoadTestReportPage
SELECT @ReportId,
       'Processor',
       '% Processor Time'  
       
INSERT INTO LoadTestReportPage
SELECT @ReportId,
       'Process',
       '% Processor Time'    
       
INSERT INTO LoadTestReportPage
SELECT @ReportId,
       'LoadTest:Page',
       'Avg. Page Time' 
       
INSERT INTO LoadTestReportPage
SELECT @ReportId,
       'LoadTest:Request',
       'Requests/Sec' 

INSERT INTO LoadTestReportPage
SELECT @ReportId,
       'LoadTest:Scenario',
       'User Load'

INSERT INTO LoadTestReportPage
SELECT @ReportId,
       'LoadTest:Test',
       'Avg. Test Time'

INSERT INTO LoadTestReportPage
SELECT @ReportId,
       'LoadTest:Test',
       'Total Tests'

INSERT INTO LoadTestReportPage
SELECT @ReportId,
       'LoadTest:Transaction',
       'Avg. Response Time'

INSERT INTO LoadTestReportPage
SELECT @ReportId,
       'LoadTest:Transaction',
       'Total Transactions' 

GO

INSERT INTO LoadTestReport
SELECT 'LOADTEST_TREND_REPORT_DEFAULT',         -- Report Name
       NULL,                                    -- Description
       'LOADTEST_TREND_REPORT_DEFAULT',         -- LoadTest
       -1,                                      -- LastRunId
       1,                                       -- SelectNewRuns
       GetUtcDate(),                            -- LastModified
       '',                                      -- User
       1                                        -- ReportType
       
DECLARE @ReportId INT
SELECT @ReportId = MAX(ReportId) FROM  LoadTestReport

INSERT INTO LoadTestReportPage
SELECT @ReportId,
       'Memory',
       'Available MBytes'
       
INSERT INTO LoadTestReportPage
SELECT @ReportId,
       'Network Interface',
       'Bytes Total/sec'
       
INSERT INTO LoadTestReportPage
SELECT @ReportId,
       'PhysicalDisk',
       '% Idle Time'
       
INSERT INTO LoadTestReportPage
SELECT @ReportId,
       'Processor',
       '% Processor Time'  
       
INSERT INTO LoadTestReportPage
SELECT @ReportId,
       'Process',
       '% Processor Time'    
      
INSERT INTO LoadTestReportPage
SELECT @ReportId,
       'LoadTest:Page',
       'Pages/Sec' 
 
INSERT INTO LoadTestReportPage
SELECT @ReportId,
       'LoadTest:Page',
       'Avg. Page Time' 
       
INSERT INTO LoadTestReportPage
SELECT @ReportId,
       'LoadTest:Request',
       'Requests/Sec' 

INSERT INTO LoadTestReportPage
SELECT @ReportId,
       'LoadTest:Scenario',
       'User Load'

INSERT INTO LoadTestReportPage
SELECT @ReportId,
       'LoadTest:Test',
       'Avg. Test Time'

INSERT INTO LoadTestReportPage
SELECT @ReportId,
       'LoadTest:Test',
       'Total Tests'

INSERT INTO LoadTestReportPage
SELECT @ReportId,
       'LoadTest:Transaction',
       'Avg. Response Time'

INSERT INTO LoadTestReportPage
SELECT @ReportId,
       'LoadTest:Transaction',
       'Transactions/Sec' 

INSERT INTO LoadTestReportPage
SELECT @ReportId,
       'LoadTest:Transaction',
       'Total Transactions' 

GO


-- Install each of the error messages into the system message table.
EXEC sp_addmessage 560500, 16, '%s: Generic error - %%error="%d";%% executing %s statement for %s', @lang = 'us_english', @replace = replace       
GO
