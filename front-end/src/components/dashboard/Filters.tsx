import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel,  SelectTrigger, SelectValue } from "../ui/select";
import { CardContent } from "../ui/card";
import { Input } from "../ui/input";


const Filters = ({ handleFilterChange} : any) => {
    return (
        <CardContent className="p-0 mt-5">
            <h3 className="text-sm text-medium mb-3 mt-5">Search Proposal</h3>
            <Input placeholder="Proposal Description" onChange={(e) => handleFilterChange(e)} />
            <h3 className="text-sm text-medium mb-3 mt-5">Sort By</h3>
            <Select>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Time Added" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Most Votes</SelectLabel>
                        <SelectItem value="apple">Active</SelectItem>
                        <SelectItem value="banana">Ended</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </CardContent>
    );
};

export default Filters;
