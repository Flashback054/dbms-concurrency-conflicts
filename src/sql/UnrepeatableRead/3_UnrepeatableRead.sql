CREATE OR ALTER
PROC sp_DocThongTinThuoc
	@MaThuoc INT,
	@SLMua INT
AS
BEGIN
	DECLARE @ERROR_MESSAGE NVARCHAR(200)

	BEGIN TRAN
		BEGIN TRY
			IF NOT EXISTS(SELECT * FROM Thuoc WHERE MaThuoc=@MaThuoc)
			BEGIN
				SET @ERROR_MESSAGE = N'Thuốc với MaThuoc ' + CAST(@MaThuoc AS VARCHAR(10)) + N' không tồn tại'
				RAISERROR(@ERROR_MESSAGE, 16, 1)
			END

			IF NOT EXISTS (SELECT *
					FROM Thuoc WHERE Thuoc.MaThuoc = @MaThuoc AND Thuoc.SoLuongTon >= @SLMua)
			BEGIN
				SET @ERROR_MESSAGE = N'Thuốc với MaThuoc ' + CAST(@MaThuoc AS VARCHAR(10)) + N' không đủ số lượng tồn'
				RAISERROR(@ERROR_MESSAGE, 16, 1)
			END

			IF NOT EXISTS (SELECT *
					FROM Thuoc WHERE Thuoc.MaThuoc = @MaThuoc AND Thuoc.NgayHetHan > GETDATE())
			BEGIN
				SET @ERROR_MESSAGE = N'Thuốc với MaThuoc ' + CAST(@MaThuoc AS VARCHAR(10)) + N' đã hết hạn'
				RAISERROR(@ERROR_MESSAGE, 16, 1)
			END

			WAITFOR DELAY '0:0:3'

			SELECT * FROM Thuoc WHERE Thuoc.MaThuoc = @MaThuoc AND Thuoc.SoLuongTon >= @SLMua
			IF (@@ROWCOUNT = 0)
			BEGIN
				SET @ERROR_MESSAGE = N'Thuốc với MaThuoc ' + CAST(@MaThuoc AS VARCHAR(10)) + N' không đủ số lượng tồn'
				RAISERROR(@ERROR_MESSAGE,16, 1)
			END
		END TRY

		BEGIN CATCH
			SELECT @ERROR_MESSAGE = ERROR_MESSAGE()
			RAISERROR(@ERROR_MESSAGE, 16, 1)
		END CATCH
	COMMIT TRAN
END
GO

CREATE OR ALTER
PROC sp_CapNhatSoLuongTonThuoc
	@MaThuoc INT,
	@SoLuongTon INT
AS
BEGIN
	DECLARE @ERROR_MESSAGE NVARCHAR(200)

	BEGIN TRAN
		BEGIN TRY
			IF NOT EXISTS(SELECT * FROM Thuoc WHERE MaThuoc=@MaThuoc)
			BEGIN
				SET @ERROR_MESSAGE = N'Thuốc với MãThuốc ' + CAST(@MaThuoc AS VARCHAR(10)) + N' không tồn tại'
				RAISERROR(@ERROR_MESSAGE, 16, 1)
			END

			IF (@SoLuongTon<0)
			BEGIN
				SET @ERROR_MESSAGE = N'Số lượng tồn cập nhật không được âm'
				RAISERROR(@ERROR_MESSAGE, 16, 1)
			END

			UPDATE Thuoc
			SET SoLuongTon = @SoLuongTon
			WHERE Thuoc.MaThuoc = @MaThuoc

		END TRY
		BEGIN CATCH
			SELECT @ERROR_MESSAGE = ERROR_MESSAGE()
			RAISERROR(@ERROR_MESSAGE, 16, 1)
			RETURN
		END CATCH
	COMMIT TRAN
END