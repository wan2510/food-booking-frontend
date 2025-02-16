export const AddEditModal = ({
    mode,
    currentFood,
    handleCancel,
    handleSave,
}) => {
    return (
        <div className="modal">
            <h3>{mode === 'edit' ? 'Edit Food' : 'Add Food'}</h3>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                }}
            >
                <div>
                    <label>Name:</label>
                    <input
                        name="name"
                        defaultValue={currentFood?.name || ''}
                        required
                    />
                </div>
                <div>
                    <label>Price:</label>
                    <input
                        name="price"
                        type="number"
                        defaultValue={currentFood?.price || ''}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        defaultValue={currentFood?.description || ''}
                    />
                </div>
                <button type="submit">Save</button>
                <button type="button" onClick={handleCancel}>
                    Cancel
                </button>
            </form>
        </div>
    );
};
