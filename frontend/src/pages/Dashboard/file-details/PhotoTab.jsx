import React, { useState, useEffect, useRef } from 'react';
import { FiCamera, FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import FormButton from '../../../components/ui/FormButton';
import FormSelect from '../../../components/ui/FormSelect';
import { getInventoryItems, uploadProductPhoto, deleteProductPhoto } from '../../../services/inventoryService';

export function PhotoTab() {
    const [items, setItems] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [isProductLocked, setIsProductLocked] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef(null);

    // Fetch products list on mount
    const fetchInventoryData = async () => {
        try {
            const data = await getInventoryItems();
            setItems(data.items || []);
            return data;
        } catch (error) {
            console.error('Failed to fetch inventory data:', error);
            return { items: [] };
        }
    };

    useEffect(() => {
        fetchInventoryData();
    }, []);

    // Handle lock product
    const handleLockProduct = async () => {
        if (!selectedProductId) {
            toast.error('Please select a product before locking');
            return;
        }

        // Search in local state items
        let selected = items.find((item) => String(item.id) === String(selectedProductId));
        if (!selected) {
            const refreshed = await fetchInventoryData();
            selected = refreshed.items.find((item) => String(item.id) === String(selectedProductId));
        }

        if (selected) {
            setIsProductLocked(true);
            setImagePreview(selected.photo_url || null);
            setImageFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            toast.success('Product locked and image loaded');
        } else {
            toast.error('Selected product not found');
        }
    };

    // Handle when a user selects a file
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (e.g., 2MB limit)
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Image size exceeds 2MB limit');
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Trigger input file click window
    const triggerFileSelect = () => {
        if (!isProductLocked) return;
        fileInputRef.current.click();
    };

    // Remove/Reset the current image selection in UI / Backend
    const removeImage = async (e) => {
        if (e) e.stopPropagation(); // Stop click bubbling

        // If there's a local draft (not saved to backend yet), just reset it locally
        if (imageFile) {
            setImagePreview(null);
            setImageFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        // If it's an existing image from the backend
        if (imagePreview && !imageFile) {
            const confirmDelete = window.confirm('Are you sure you want to delete this product image?');
            if (!confirmDelete) return;

            const loadingToast = toast.loading('Deleting product image...');
            try {
                await deleteProductPhoto(selectedProductId);
                toast.success('Image deleted successfully', { id: loadingToast });

                // Update local items cache
                setItems((prevItems) =>
                    prevItems.map((item) =>
                        String(item.id) === String(selectedProductId)
                            ? { ...item, photo_url: null }
                            : item
                    )
                );
                
                // Clear the form/state
                handleClear();
            } catch (error) {
                console.error('Failed to delete image:', error);
                let msg =
                    error?.response?.data?.detail ||
                    'Unable to delete image. Please try again.';
                
                if (typeof msg === 'string') {
                    if (msg.includes("No module named 'PIL'") || msg.includes('PIL') || msg.includes('Pillow')) {
                        msg = 'The server is missing an image processing dependency. Please contact administrator.';
                    } else if (msg.includes('ImportError') || msg.includes('Traceback') || msg.includes('Server Error') || msg.includes('Internal Server Error')) {
                        msg = 'A server error occurred. Please try again later.';
                    }
                }
                toast.error(msg, { id: loadingToast });
            }
        }
    };

    // Save the image
    const handleSave = async () => {
        if (!isProductLocked) {
            toast.error('Please lock a product first');
            return;
        }
        if (!imageFile) {
            toast.error('Please select an image first');
            return;
        }

        setIsSaving(true);
        const loadingToast = toast.loading('Saving product image...');
        try {
            const formData = new FormData();
            formData.append('item_id', selectedProductId);
            formData.append('image', imageFile);

            const data = await uploadProductPhoto(formData);
            toast.success(data.message || 'Image uploaded successfully', { id: loadingToast });

            // Update local items cache with the new photo_url
            setItems((prevItems) =>
                prevItems.map((item) =>
                    String(item.id) === String(selectedProductId)
                        ? { ...item, photo_url: data.photo_url }
                        : item
                )
            );
            handleClear();
        } catch (error) {
            console.error('Failed to save image:', error);
            let msg =
                error?.response?.data?.detail ||
                error?.response?.data?.image?.[0] ||
                'Unable to save image. Please try again.';
            
            // Sanitize raw technical or module installation errors
            if (typeof msg === 'string') {
                if (msg.includes("No module named 'PIL'") || msg.includes('PIL') || msg.includes('Pillow')) {
                    msg = 'The server is missing an image processing dependency. Please contact administrator.';
                } else if (msg.includes('ImportError') || msg.includes('Traceback') || msg.includes('Server Error') || msg.includes('Internal Server Error')) {
                    msg = 'A server error occurred. Please try again later.';
                }
            }
            toast.error(msg, { id: loadingToast });
        } finally {
            setIsSaving(false);
        }
    };

    // Reset whole form state
    const handleClear = () => {
        setSelectedProductId('');
        setIsProductLocked(false);
        setImagePreview(null);
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="w-full space-y-4 rounded-md p-2 bg-white">
            {/* Product Selection Section */}
            <div className="bg-white rounded-md border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200/60 px-4 py-2">
                    <h3 className="text-xs font-bold text-slate-800 tracking-wide">
                        Product Selection
                    </h3>
                </div>

                <div className="p-4 flex flex-col md:flex-row gap-4 items-end">
                    <div className="relative flex-1 w-full pb-6">
                        <FormSelect
                            label="Product"
                            className="w-full disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={isProductLocked}
                            required
                            value={selectedProductId}
                            onChange={(e) => setSelectedProductId(e.target.value)}
                        >
                            <option value="">Select product</option>
                            {items.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.item_code} - {item.name_1}
                                </option>
                            ))}
                        </FormSelect>
                    </div>

                    <div className="relative flex flex-col pb-6">
                        <FormButton
                            variant="primary"
                            className="h-8.5 disabled:cursor-not-allowed disabled:opacity-60"
                            onClick={handleLockProduct}
                            disabled={!selectedProductId || isProductLocked}
                        >
                            Lock Product
                        </FormButton>
                    </div>
                </div>
            </div>

            {/* PHOTO ASSET UPLOAD CONTAINER */}
            <div className={`bg-white rounded-md border border-slate-200/80 shadow-xs overflow-hidden transition-all duration-200 ${!isProductLocked ? 'opacity-60' : ''}`}>
                
                {/* Section Header */}
                <div className="bg-slate-50 border-b border-slate-200/60 px-4 py-2">
                    <h3 className="text-xs font-bold text-slate-800 tracking-wide">
                        Item Image
                    </h3>
                </div>

                {/* Upload Content Matrix */}
                <div className="p-6 flex flex-col items-center justify-center min-h-[280px]">
                    
                    {/* Hidden Native File Input */}
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                        disabled={!isProductLocked}
                    />

                    {!imagePreview ? (
                        /* STATE A: EMPTY UPLOAD PLACEHOLDER BOX */
                        <div 
                            onClick={triggerFileSelect}
                            className={`w-full max-w-md border border-dashed border-slate-200 rounded-lg p-12 text-center transition-all flex flex-col items-center justify-center ${isProductLocked ? 'cursor-pointer hover:border-slate-300 bg-slate-50/20 hover:bg-slate-50/50 group' : 'cursor-not-allowed bg-slate-100/20'}`}
                        >
                            <div className={`bg-slate-100 p-3.5 rounded-full text-slate-400 mb-3 ${isProductLocked ? 'group-hover:text-slate-500 group-hover:scale-105 transition-all' : ''}`}>
                                <FiCamera className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-semibold text-slate-600 block mb-1">
                                {isProductLocked ? 'Click to upload item image' : 'Lock product to upload image'}
                            </span>
                            <span className="text-[11px] text-slate-400">
                                Supports PNG, JPG, JPEG up to 2MB
                            </span>
                        </div>
                    ) : (
                        /* STATE B: IMAGE PREVIEW MATRIX VIEW WITH ACTIONS */
                        <div className="relative w-full max-w-xs aspect-square bg-slate-50 border border-slate-200/80 rounded-lg overflow-hidden shadow-2xs group">
                            
                            {/* Rendered Asset View */}
                            <img 
                                src={imagePreview} 
                                alt="Item Preview" 
                                className="w-full h-full object-contain p-2"
                            />

                            {/* Action Overlay Toolbar on Hover */}
                            {isProductLocked && (
                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button
                                        type="button"
                                        onClick={triggerFileSelect}
                                        className="p-2 bg-white/90 hover:bg-white text-slate-700 rounded-full text-xs shadow-xs transition-transform hover:scale-110 font-semibold px-3 flex items-center gap-1.5 cursor-pointer"
                                        title="Change Image"
                                    >
                                        <FiRefreshCw className="w-3 h-3" />
                                        <span>Change</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs shadow-xs transition-transform hover:scale-110 font-semibold px-3 flex items-center gap-1.5 cursor-pointer"
                                        title="Remove Image"
                                    >
                                        <FiTrash2 className="w-3 h-3" />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>

            {/* COMMON FORM FOOTER UTILITY BUTTONS */}
            <div className="flex justify-end items-center gap-2 pt-2 border-t border-slate-100">
                <FormButton 
                    variant="success" 
                    onClick={handleSave}
                    disabled={!isProductLocked || !imageFile || isSaving}
                >
                    Save
                </FormButton>
                
                <FormButton variant="secondary" onClick={handleClear}>
                    Clear
                </FormButton>
            </div>

        </div>
    );
}