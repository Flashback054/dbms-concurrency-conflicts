
CREATE OR ALTER PROCEDURE UpdateLichHen
    @MaNhaSi INT,
    @MaLichHen INT,
    @NgayHen DATE,
    @ThoiGianBatDau TIME,
    @ThoiGianKetThuc TIME
AS
BEGIN TRAN
    BEGIN TRY
        -- Bước 1: Kiểm tra sự tồn tại của lịch hẹn
        IF NOT EXISTS (SELECT 1 FROM LichHen WHERE MaLichHen = @MaLichHen)
        BEGIN
            PRINT N'Lịch hẹn không tồn tại.';
			ROLLBACK TRAN
            RETURN 0
        END

        -- Bước 2: Kiểm tra lịch của NhaSi
        IF NOT EXISTS (SELECT 1 FROM LichHen WHERE MaLichHen = @MaLichHen AND MaNhaSi = @MaNhaSi)
        BEGIN
            PRINT N'NhaSi không có quyền cập nhật lịch này.';
            ROLLBACK TRAN
            RETURN 0
        END

    	-- Bước 3: Kiểm tra lịch của NhaSi có được đặt hay chưa, được đặt rồi thì không thể update
        IF EXISTS (SELECT 1 FROM LichHen WHERE MaLichHen = @MaLichHen AND MaNguoiDat IS NOT NULL)
        BEGIN
            PRINT N'NhaSi không thể cập nhật 1 lịch đã được đặt.';
            ROLLBACK TRAN
            RETURN 0
        END

    	-- Bước 4: Update từng trường dữ liệu
        UPDATE LichHen
        SET NgayHen = @NgayHen
        WHERE MaLichHen = @MaLichHen;

		--ĐỂ TEST------------
		WAITFOR DELAY '0:0:06'
		--------------------

        UPDATE ChiTietLichHen
        SET ThoiGianBatDau = @ThoiGianBatDau,
            ThoiGianKetThuc = @ThoiGianKetThuc
        WHERE MaLichHen = @MaLichHen;

		
        -- Bước 5: Kiểm tra lịch có trùng không dùng khi không có trigger
        -- IF EXISTS (
        --     SELECT 1
        --     FROM LichHen lh
        --     JOIN ChiTietLichHen clh ON lh.MaLichHen = clh.MaLichHen
        --     WHERE lh.MaNhaSi = @MaNhaSi
        --         AND lh.MaLichHen != @MaLichHen
        --         AND ((@ThoiGianBatDau BETWEEN clh.ThoiGianBatDau AND clh.ThoiGianKetThuc)
        --             OR (@ThoiGianKetThuc BETWEEN clh.ThoiGianBatDau AND clh.ThoiGianKetThuc))
        -- )
        -- BEGIN
        --     PRINT N'Lịch hẹn thời gian bị trùng với lịch khác của bạn.';
		-- 	ROLLBACK TRAN
        --     RETURN 0
        -- END
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMsg VARCHAR(2000)
		SELECT @ErrorMsg = 'ERROR: ' + ERROR_MESSAGE()
		RAISERROR(@ErrorMsg, 16,1)
		ROLLBACK TRAN
		RETURN 0
    END CATCH
COMMIT TRAN;
RETURN 1
GO


-- in ra Thông tin của 1 lịch hẹn cho khách hàng 
CREATE or alter PROCEDURE ChiTietLich
(
	@MaLichHen INT,
	@NgayHen DATE OUT,
	@MaNhaSi INT OUT,
	@HoTenNhaSi NVARCHAR(255)  OUT,
	@ThoiGianBatDau TIME  OUT,
	@ThoiGianKetThuc TIME  OUT
)
AS
-- giao tác chỉ đọc thông tin lịch hẹn---
SET TRAN ISOLATION LEVEL READ UNCOMMITTED
BEGIN TRAN
	BEGIN TRY
		IF NOT EXISTS(SELECT * 
					FROM LichHen 
					WHERE MaLichHen = @MaLichHen)
		BEGIN
			PRINT N'Lịch hẹn không tồn tại !'
			ROLLBACK TRAN
			RETURN 
		END

		
		-- Lấy dữ liệu từ bảng lịch hẹn
		
		SELECT
			@NgayHen = LH.NgayHen,
			@MaNhaSi = LH.MaNhaSi,
			@HoTenNhaSi = NS.HoTen,
			@ThoiGianBatDau = CLH.ThoiGianBatDau,
			@ThoiGianKetThuc = CLH.ThoiGianKetThuc
		FROM LichHen AS LH
		JOIN ChiTietLichHen AS CLH ON LH.MaLichHen = CLH.MaLichHen
		JOIN NhaSi AS NS ON LH.MaNhaSi = NS.MaNhaSi
		WHERE LH.MaLichHen = @MaLichHen;
		-- Trả về kết quả
	END TRY
	BEGIN CATCH
		PRINT N'LỖI HỆ THỐNG'
		ROLLBACK TRAN
	END CATCH
COMMIT TRAN
RETURN 1
GO
