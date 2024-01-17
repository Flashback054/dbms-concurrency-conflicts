CREATE OR ALTER
PROC sp_GetStockStatistics
	@NoInstances INT OUT,
	@NoExpiredInstances INT OUT,
	@NoOOSInstances INT OUT
AS
SET TRAN ISOLATION LEVEL SERIALIZABLE
BEGIN TRAN
	BEGIN TRY
		(SELECT @NoInstances = COUNT(*) FROM Thuoc)

		(SELECT @NoExpiredInstances = COUNT(*)
			FROM Thuoc
			WHERE NgayHetHan < GETDATE())

		WAITFOR DELAY '0:0:2'

		(SELECT @NoOOSInstances = COUNT(*)
			 FROM Thuoc
			 WHERE SoLuongTon <= 0)
	END TRY

	BEGIN CATCH
		DECLARE @ErrorMsg NVARCHAR(2000)
		SELECT @ErrorMsg = 'ERROR: ' + ERROR_MESSAGE()
		RAISERROR(@ErrorMsg, 16,1)
	END CATCH
COMMIT TRAN
GO