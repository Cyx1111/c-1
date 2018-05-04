USE [LoadTest2010]
GO

UPDATE LoadTestSchemaRevision
SET    LoadTestSchemaRev = 3
GO

ALTER TABLE [dbo].[LoadTestTransactionDetail] 
    ADD [ResponseTime] [float] NULL
GO

ALTER TABLE [dbo].[LoadTestTransactionSummaryData]
    ADD [AvgTransactionTime] float NULL 
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

CREATE NONCLUSTERED INDEX [LoadTestTestDetail4] ON [dbo].[LoadTestTestDetail] ([LoadTestRunId] ASC, [TestCaseId] ASC,[InMeasurementInterval] ASC, [ElapsedTime] DESC) WITH (DROP_EXISTING = ON)

CREATE NONCLUSTERED INDEX [LoadTestTransactionDetail4] ON [dbo].[LoadTestTransactionDetail] ([LoadTestRunId] ASC, [TransactionId] ASC,[InMeasurementInterval] ASC,  [ResponseTime] DESC, [TestDetailId] ASC ) INCLUDE ( [TimeStamp],[EndTime]) WITH (DROP_EXISTING = ON)

CREATE NONCLUSTERED INDEX [LoadTestPageDetail4] ON [dbo].[LoadTestPageDetail] ([LoadTestRunId] ASC,  [PageId] ASC,[InMeasurementInterval] ASC,[ResponseTime] DESC ) INCLUDE ([TestDetailId],[ResponseTimeGoal])   WITH (DROP_EXISTING = ON)

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


ALTER PROCEDURE Prc_DeleteLoadTestRun @LoadTestRunId int
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


ALTER PROCEDURE [dbo].[Prc_InsertTransactionDetail2]
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

ALTER PROCEDURE [dbo].[prc_FindLoadTestReport] 
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

ALTER PROCEDURE [dbo].[prc_QueryLoadTestReports]    
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

ALTER PROCEDURE [dbo].[Prc_GetUserTestDetail]
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

ALTER PROCEDURE [dbo].[Prc_GetUserPageDetail]
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

ALTER PROCEDURE Prc_UpdateTransactionSummary @LoadTestRunId int, @TransactionId int
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


ALTER PROCEDURE Prc_UpdatePageSummary @LoadTestRunId int, @PageId int
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

ALTER PROCEDURE Prc_UpdatePageSummaryByNetwork @LoadTestRunId int, @PageId int, @NetworkId int
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

ALTER  PROCEDURE Prc_UpdateTestSummary @LoadTestRunId int, @TestCaseId int
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

ALTER PROCEDURE Prc_UpdateSummaryData2 @LoadTestRunId int, @DeleteDetailTables bit
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

ALTER PROCEDURE [dbo].[Prc_QueryLoadTestTransactionComparison]
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