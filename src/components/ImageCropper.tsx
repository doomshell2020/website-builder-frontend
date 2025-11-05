import React, { useRef } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

type Props = {
  imageSrc: string;
  onCropped: (croppedFile: File, previewUrl: string) => void;
  onCancel: () => void;
  aspectRatio?: number;
};

const ImageCropper: React.FC<Props> = ({
  imageSrc,
  onCropped,
  onCancel,
  aspectRatio = 1,
}) => {
  const cropperRef = useRef<ReactCropperElement>(null);

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    const canvas = cropper.getCroppedCanvas();
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], "cropped-image.png", { type: "image/png" });
      const previewUrl = URL.createObjectURL(file);
      onCropped(file, previewUrl);
    }, "image/png");
  };

  return (
    <div className="space-y-4">
      <Cropper
        src={imageSrc}
        style={{ height: 400, width: "100%" }}
        initialAspectRatio={aspectRatio}
        guides={true}
        viewMode={1}
        background={false}
        responsive={true}
        autoCropArea={1}
        checkOrientation={false}
        ref={cropperRef}
      />
      <div className="flex justify-between gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-red-500 text-white px-4 py-2 rounded shadow"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleCrop}
          className="bg-green-600 text-white px-4 py-2 rounded shadow"
        >
          Crop
        </button>
      </div>
    </div>
  );
};

export default ImageCropper;
