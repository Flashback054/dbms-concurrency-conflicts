USE QLPHONGKHAMNHAKHOA
GO 
CREATE OR ALTER PROC USP_KHOATAIKHOAN
    @MaTaiKhoan INT
AS 
BEGIN TRAN
    -- ĐƯA TOÀN BỘ GIAO TÁC VỀ MỨC CÔ LẬP MẶC ĐỊNH.
    SET TRAN ISOLATION LEVEL READ COMMITTED
    BEGIN TRY
        -- LẦN LƯỢT KIỂM TRA TÀI KHOẢN CÓ TỒN TẠI HAY KHÔNG
        -- NẾU TỒN TẠI THÌ TIẾN HÀNH CẬP NHẬT TRẠNG THÁI ĐÃ KHOÁ.

        IF  EXISTS (SELECT * FROM KhachHang WHERE MaKhachHang = @MaTaiKhoan)
            BEGIN 
                -- ĐỢI GIAO TÁC 2.
                WAITFOR DELAY '0:0:10'

                -- TIẾN HÀNH CẬP NHẬT THÔNG TIN TÀI KHOẢN.
                UPDATE KhachHang
                SET TrangThai = N'Đã khoá'
                WHERE MaKhachHang = @MaTaiKhoan
            END
        ELSE IF EXISTS (SELECT * FROM NhaSi WHERE MaNhaSi = @MaTaiKhoan)
            BEGIN
                -- ĐỢI GIAO TÁC 2.
                WAITFOR DELAY '0:0:10'

                -- TIẾN HÀNH CẬP NHẬT THÔNG TIN TÀI KHOẢN.
                UPDATE NhaSi
                SET TrangThai = N'Đã khoá'
                WHERE MaNhaSi = @MaTaiKhoan
            END
        ELSE IF EXISTS (SELECT * FROM NhanVien WHERE MaNhanVien = @MaTaiKhoan)
            BEGIN 
                -- ĐỢI GIAO TÁC 2.
                WAITFOR DELAY '0:0:10'

                -- TIẾN HÀNH CẬP NHẬT THÔNG TIN TÀI KHOẢN.
                UPDATE NhanVien
                SET TrangThai = N'Đã khoá'
                WHERE MaNhanVien = @MaTaiKhoan
            END
        ELSE    
            BEGIN
                PRINT N'TÀI KHOẢN KHÔNG TỒN TẠI!'
                ROLLBACK TRAN
                RETURN 1
            END
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMsg VARCHAR(2000)
		SELECT @ErrorMsg = N'ERROR_MESSAGE: ' + ERROR_MESSAGE()
		RAISERROR(@ErrorMsg, 16,1)
		ROLLBACK TRAN
		RETURN 1
    END CATCH
COMMIT TRAN
RETURN 0
GO

CREATE OR ALTER PROC USP_CAPNHATTHONGTIN
    @MaKhachHang INT, 
    @MatKhau nvarchar(20)
AS
BEGIN TRAN 
    -- ĐƯA TOÀN BỘ GIAO TÁC VỀ MỨC CÔ LẬP REPEATABLE READ.
    SET TRAN ISOLATION LEVEL REPEATABLE READ   
    BEGIN TRY
        -- KIỂM TRA TÀI KHOẢN CÓ BỊ KHOÁ HOẶC KHÔNG TỒN TẠI HAY KHÔNG.
        -- NẾU THOẢ MÃN THÌ THƯC HIỆN CẬP NHẬT THÔNG TIN KHÁCH HÀNG.
        IF EXISTS (SELECT * FROM KhachHang WHERE MaKhachHang = @MaKhachHang AND (TrangThai <> N'Đã khoá' OR TrangThai IS NULL))
        BEGIN
            -- GIỮ KHOÁ S CỦA KHÁCH HÀNG CHO ĐẾN HẾT GIAO TÁC ĐỂ CẬP NHẬT HOÀN TẤT THÔNG TIN KHÁCH HÀNG.
            -- CẬP NHẬT THÔNG TIN KHÁCH HÀNG.
            UPDATE KhachHang
            SET MatKhau = @MatKhau
            WHERE MaKhachHang = @MaKhachHang
        END
        ELSE    
            BEGIN 
                PRINT N'MÃ KHÁCH HÀNG KHÔNG TỒN TẠI'
                ROLLBACK TRAN
                RETURN 1
            END
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMsg VARCHAR(2000)
		SELECT @ErrorMsg = N'ERROR_MESSAGE: ' + ERROR_MESSAGE()
		RAISERROR(@ErrorMsg, 16,1)
		ROLLBACK TRAN
		RETURN 1
    END CATCH
COMMIT TRAN
RETURN 0
GO