import React, { useState, useRef } from 'react';
import { FiCamera, FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import FormButton from '../../../components/ui/FormButton';

export function PhotoTab() {
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    // Handle when a user selects a file
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Trigger input file click window
    const triggerFileSelect = () => {
        fileInputRef.current.click();
    };

    // Remove the current image asset
    const removeImage = (e) => {
        e.stopPropagation(); // Stop click bubbling
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="w-full space-y-4 rounded-md p-2 bg-white">
            
            {/* PHOTO ASSET UPLOAD CONTAINER */}
            <div className="bg-white rounded-md border border-slate-200/80 shadow-xs overflow-hidden">
                
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
                    />

                    {!imagePreview ? (
                        /* STATE A: EMPTY UPLOAD PLACEHOLDER BOX */
                        <div 
                            onClick={triggerFileSelect}
                            className="w-full max-w-md border border-dashed border-slate-200 hover:border-slate-300 rounded-lg p-12 text-center cursor-pointer bg-slate-50/20 hover:bg-slate-50/50 transition-all flex flex-col items-center justify-center group"
                        >
                            <div className="bg-slate-100 p-3.5 rounded-full text-slate-400 group-hover:text-slate-500 group-hover:scale-105 transition-all mb-3">
                                <FiCamera className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-semibold text-slate-600 block mb-1">
                                Click to upload item image
                            </span>
                            <span className="text-[11px] text-slate-400">
                                Supports PNG, JPG, JPEG up to 2MB
                            </span>
                        </div>
                    ) : (
                        /* STATE B: IMAGE PREVIEW MATRIX VIEW WITH ACTIONS */
                        <div className="relative w-full max-w-xs aspect-square bg-slate-50 border border-slate-200/80 rounded-lg overflow-hidden group shadow-2xs">
                            
                            {/* Rendered Asset View */}
                            <img 
                                src={imagePreview} 
                                alt="Item Preview" 
                                className="w-full h-full object-contain p-2"
                            />

                            {/* Action Overlay Toolbar on Hover */}
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
                        </div>
                    )}

                </div>
            </div>

            {/* COMMON FORM FOOTER UTILITY BUTTONS */}
            <div className="flex justify-end items-center gap-2 pt-2 border-t border-slate-100">
                <FormButton variant="success" onClick={() => console.log('Save clicked')}>
                    Save
                </FormButton>
                
                <FormButton variant="primary" onClick={() => console.log('List clicked')}>
                    List
                </FormButton>
                
                <FormButton variant="secondary" onClick={removeImage}>
                    Clear
                </FormButton>
            </div>

        </div>
    );
}