import React, { useEffect, useState } from "react";
import { FormControl } from "../FormElements/FormControl";

export default function TaxInformation({
    handleSubmit,
    disabled = false
}: {
    handleSubmit?: () => void;
    disabled?: boolean
}) {

    return (
        <>
            <div className="row">
                <div className="col-12 col-md-6">
                    <FormControl
                        label="Parcel ID"
                        name="taxInfo.parcelId"
                        type="Name"
                    />

                </div>
                <div className="col-12 col-md-6">
                    <FormControl
                        label="Square"
                        name="taxInfo.square"
                        type="Name"
                    />

                </div>
                <div className="col-12 col-md-6">
                    <FormControl
                        label="Suffix"
                        name="taxInfo.suffix"
                        type="Last"
                    />
                </div>

                <div className="col-12 col-md-6">
                    <FormControl
                        label="Lot"
                        name="taxInfo.lot"
                        type="Last"
                    />
                </div>
            </div>
        </>
    );
}
