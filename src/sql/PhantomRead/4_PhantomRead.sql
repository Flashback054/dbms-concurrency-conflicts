CREATE OR ALTER
PROCEDURE sp_InsertThuocInstance
	@TenThuoc NVARCHAR(255),
	@DonViTinh NVARCHAR(50),
	@DonGia FLOAT,
	@ChiDinh NVARCHAR(MAX),
	@SoLuongTon INT,
	@NgayHetHan DATE
AS
BEGIN TRAN
	BEGIN TRY
		IF EXISTS (SELECT * FROM Thuoc WHERE TenThuoc = @TenThuoc)
		BEGIN
			RAISERROR(N'Thuốc đã tồn tại.', 16, 1)
		END

		INSERT INTO Thuoc (TenThuoc, DonViTinh, DonGia, ChiDinh, SoLuongTon, NgayHetHan)
		VALUES (@TenThuoc, @DonViTinh, @DonGia, @ChiDinh, @SoLuongTon, @NgayHetHan);
	END TRY

	BEGIN CATCH
		DECLARE @ErrorMsg NVARCHAR(2000)
		SELECT @ErrorMsg = ERROR_MESSAGE()
		RAISERROR(@ErrorMsg,16, 1)
	END CATCH
COMMIT TRAN
GO

CREATE OR ALTER
PROC sp_GetStockStatistics
	@NoInstances INT OUT,
	@NoExpiredInstances INT OUT,
	@NoOOSInstances INT OUT
AS
SET TRAN ISOLATION LEVEL REPEATABLE READ
BEGIN TRAN
	BEGIN TRY
		(SELECT @NoInstances = COUNT(*) FROM Thuoc)

		(SELECT @NoExpiredInstances = COUNT(*)
			FROM Thuoc
			WHERE NgayHetHan < GETDATE())

		---------------------------------
		WAITFOR DELAY '0:0:2'
		---------------------------------

		(SELECT @NoOOSInstances = COUNT(*)
			 FROM Thuoc
			 WHERE SoLuongTon <= 0)
	END TRY

	BEGIN CATCH
		DECLARE @ErrorMsg NVARCHAR(2000)
		SELECT @ErrorMsg = ERROR_MESSAGE()
		RAISERROR(@ErrorMsg, 16,1)
	END CATCH
COMMIT TRAN
GO