import {Table} from "react-bootstrap";
import {useState} from "react";


type CellSelectableTableProps = {
    data: any[],
    fields: CellSelectableTableField[],
    getData: (data: any[], rowSelection: number[]) => void
}

type CellSelectableTableField = {
    label: string;
    value: string;
    pickable: boolean;
}

const CellSelectableTable = (props: CellSelectableTableProps) => {

    const {
        data,
        fields,
        getData
    } = props

    const [rowSelection, setRowSelection] = useState(fields.map(() => 0));

    return (
        <Table bordered striped>
            <thead>
            <tr>
                <th>Field</th>
                {
                    data.map((element, index) => {

                        return (
                            <th key={`${index}_${element.id}`}>
                                Duplicate {index + 1}
                            </th>
                        )
                    })
                }
            </tr>
            </thead>
            <tbody>
            {
                fields.map((fieldMapping, fieldIndex) => (
                    <tr key={`${fieldIndex}_${fieldMapping.value}`}>
                        <td className='fw-bold'>{fieldMapping.label}</td>
                        {
                            data.map((element, stockIndex) => (
                                <td
                                    key={`${fieldMapping.value}_${element.id}`}
                                    className={`${!fieldMapping.pickable && rowSelection[0] === stockIndex ? 'bg-secondary' : ''}
                                        ${fieldMapping.pickable && rowSelection[fieldIndex] === stockIndex ? 'bg-primary' : ''}`}
                                    onClick={() => {

                                        if (!fieldMapping.pickable) return;

                                        let nextRowSelection = [...rowSelection];

                                        if (fieldIndex !== 0) {

                                            nextRowSelection[fieldIndex] = stockIndex;
                                        } else {

                                            nextRowSelection = nextRowSelection.map(() => stockIndex);
                                        }

                                        setRowSelection(nextRowSelection);
                                        getData(data, nextRowSelection);
                                    }}
                                >
                                    {element[fieldMapping.value]?.toString()}
                                </td>
                            ))
                        }
                    </tr>
                ))
            }
            </tbody>
        </Table>
    );
}

export default CellSelectableTable;