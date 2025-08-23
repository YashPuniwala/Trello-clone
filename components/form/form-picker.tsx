"use client";

import { defaultImages } from "@/constants/images";
import { unsplash } from "@/lib/unsplash";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { FormErrors } from "./form-errors";

interface FormPickerProps {
  id: string;
  errors?: Record<string, string[] | undefined>;
}

interface UnsplashImage {
  id: string;
  urls: {
    thumb: string;
    full: string;
  };
  user: {
    name: string;
  };
  links: {
    html: string;
  };
}

const FormPicker = ({ id, errors }: FormPickerProps) => {
  const { pending } = useFormStatus();

  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const result = await unsplash.photos.getRandom({
          collectionIds: ["317099"],
          count: 9,
        });

        if (result && result.response) {
          const newImages = result.response as UnsplashImage[];
          setImages(newImages);
        } else {
          console.error("Failed to get images from Unsplash");
        }
      } catch (error) {
        console.log(error);
        setImages(defaultImages);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-sky-700 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-2 mb-2">
        {images.map((image) => {
          const isSelected = selectedImageId === image.id;
          return (
            <div
              key={image.id}
              className={cn(
                "cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted",
                pending && "opacity-50 hover:opacity-50 cursor-auto"
              )}
              onClick={() => {
                if (pending) return;
                setSelectedImageId(image.id);
              }}
            >
              {/* Checkmark Overlay */}
              {isSelected && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
                  <Check className="h-6 w-6 text-white" />
                </div>
              )}

              <input
                type="radio"
                name={id}
                className="hidden"
                value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.user.name}|${image.links.html}`}
                checked={isSelected}
                readOnly
              />

              <Image
                src={image.urls.thumb}
                alt="Unsplash image"
                className="object-cover rounded-sm"
                fill
              />

              <Link
                href={image.links.html}
                target="_blank"
                className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50"
              >
                {image.user.name}
              </Link>
            </div>
          );
        })}
      </div>
      <FormErrors id="image" errors={errors} />
    </div>
  );
};

export default FormPicker;
