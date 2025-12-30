import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MainLayout } from '../components/layout/MainLayout';
import { LocationPickerMap } from '../components/maps/LocationPickerMap';
import { Button } from '../components/common/Button';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useCategories, useCreateRequest, useUploadAttachment } from '../hooks/useApi';
import { CreateRequestSchema, type CreateRequestPayload } from '../types/api';

export const ReportIssuePage: React.FC = () => {
  const navigate = useNavigate();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const createRequestMutation = useCreateRequest();
  const uploadAttachmentMutation = useUploadAttachment();

  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateRequestPayload>({
    resolver: zodResolver(CreateRequestSchema),
  });

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setValue('latitude', lat);
    setValue('longitude', lng);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: CreateRequestPayload) => {
    try {
      // Create the request
      const request = await createRequestMutation.mutateAsync(data);

      // Upload attachment if selected
      if (selectedFile && request.id) {
        try {
          await uploadAttachmentMutation.mutateAsync({
            requestId: request.id,
            file: selectedFile,
          });
        } catch (error) {
          console.warn('Failed to upload attachment, but request was created:', error);
        }
      }

      // Navigate to the request detail page
      navigate(`/requests/${request.id}`);
    } catch (error) {
      console.error('Failed to create request:', error);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Report an Issue</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Category Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            {categoriesLoading ? (
              <LoadingSpinner size="sm" />
            ) : categories && categories.length > 0 ? (
              <select
                {...register('category_id')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                Categories endpoint not yet available. Using fallback options.
                <select
                  {...register('category_id')}
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  <option value="road_damage">Road Damage</option>
                  <option value="streetlight">Street Light</option>
                  <option value="waste">Waste Management</option>
                  <option value="vandalism">Vandalism</option>
                  <option value="other">Other</option>
                </select>
              </div>
            )}
            {errors.category_id && (
              <p className="mt-1 text-sm text-red-600">{errors.category_id.message}</p>
            )}
          </div>

          {/* Location Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <p className="text-sm text-gray-600 mb-4">
              Click on the map to set the issue location, or use your current location.
            </p>
            <div className="h-96 mb-4">
              <LocationPickerMap
                onLocationSelect={handleLocationSelect}
                selectedLocation={selectedLocation}
                className="h-full"
              />
            </div>
            {selectedLocation && (
              <p className="text-sm text-gray-600">
                Selected: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
              </p>
            )}
            {(errors.latitude || errors.longitude) && (
              <p className="mt-1 text-sm text-red-600">Please select a location on the map</p>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              {...register('description')}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Please describe the issue in detail..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Photo Upload */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo (Optional)
            </label>
            <p className="text-sm text-gray-600 mb-4">
              Upload a photo to help illustrate the issue
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-white
                hover:file:bg-primary/90
                file:cursor-pointer"
            />
            {previewUrl && (
              <div className="mt-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-xs rounded-lg shadow-md"
                />
              </div>
            )}
          </div>

          {/* Error Message */}
          {createRequestMutation.isError && (
            <ErrorMessage
              title="Failed to submit request"
              message={(createRequestMutation.error as Error).message}
            />
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={createRequestMutation.isPending || uploadAttachmentMutation.isPending}
            >
              Submit Request
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};
