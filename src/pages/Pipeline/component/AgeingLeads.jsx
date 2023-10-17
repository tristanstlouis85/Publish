import React, { useEffect, useState } from 'react';
import { Col, Card, CardBody, Table, Row, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { currentYearStart, currentYearEnd } from '../lib/date';

const InfoTableLeading = ({ ageingLeadsData }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedAgeingLeadsOption, setSelectedAgeingLeadsOption] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [resOpp, setResOpp] = useState([]);
    const [error, setError] = useState("");
    const rowsPerPage = 6;

    /** TOKEN */
    const base_URL = localStorage.getItem("base_URL");

    const ageingLeadsOptions = [
      "> 30 days",
      "> 60 days",
      "> 90 days",
    ];

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };
  
    const handleOptionSelect = async (option) => {
        setSelectedAgeingLeadsOption(option);

        const filteredData = ageingLeadsData.filter((item) => {

            const currentDate = new Date();
            const createdDate = new Date(item.CreatedDate);
            
            const previousMonthDate = new Date(currentDate);
            previousMonthDate.setMonth(currentDate.getMonth());
            previousMonthDate.setDate(0);
            
            const preyear = previousMonthDate.getFullYear();
            const premonth = String(previousMonthDate.getMonth() + 1).padStart(2, '0');
            const preday = String(previousMonthDate.getDate()).padStart(2, '0');
            
            const objyear = createdDate.getFullYear();
            const objmonth = String(createdDate.getMonth() + 1).padStart(2, '0');
            const objday = String(createdDate.getDate()).padStart(2, '0');
            
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            
            if (option === "> 30 days") {
                
                if (Number(day) - 30 > 0) {
                    const newday = Number(preday) + Number(day) - 30;

                    const timeLeading = `${year}-${month}-${newday}`;
                    const objectitem = `${objyear}-${objmonth}-${objday}`;

                    return objectitem >= timeLeading;

                } else {
                    const date = Number(day) - 30;
                    const newday = Number(preday) + date;

                    const timeLeading = `${preyear}-${premonth}-${newday}`;
                    const objectitem = `${objyear}-${objmonth}-${objday}`;
                    
                    return objectitem >= timeLeading;
                }

            } else if (option === "> 60 days") {

                const date = Number(day) - 60;
                const newday = Number(preday) + date;
                
                if (newday > 0) {
                    const newpreday = Number(preday) + newday;

                    const timeLeading = `${preyear}-${premonth}-${newpreday}`;
                    const objectitem = `${objyear}-${objmonth}-${objday}`;

                    return objectitem >= timeLeading;
                } else {
                    const newpreday = Number(preday) + newday;
                    const newMonth = Number(premonth) - 1;
                    const newMonthPer = String(newMonth).padStart(2, '0');
                    
                    const timeLeading = `${preyear}-${newMonthPer}-${newpreday}`;
                    const objectitem = `${objyear}-${objmonth}-${objday}`;

                    return objectitem >= timeLeading;
                }

            } else if (option === "> 90 days") {
                
                const date = Number(day) - 90;
                const newday = Number(preday) + date;
                const thirdMoth = Number(preday) + newday;
                
                if (thirdMoth > 0) {
                    const newpreday = Number(preday) + thirdMoth;
                    const newMonth = Number(premonth) - 1;
                    const month = String(newMonth).padStart(2, '0');
                    
                    const timeLeading = `${preyear}-${month}-${newpreday}`;
                    const objectitem = `${objyear}-${objmonth}-${objday}`;

                    return objectitem >= timeLeading;
                } else {
                    const newpreday = Number(preday) + thirdMoth;
                    const newMonth = Number(premonth) - 2;
                    const month = String(newMonth).padStart(2, '0');

                    const timeLeading = `${preyear}-${month}-${newpreday}`;
                    const objectitem = `${objyear}-${objmonth}-${objday}`;

                    return objectitem >= timeLeading;
                }

            }
        });
        
        const newInfo = filteredData.slice((currentPage - 1) * rowsPerPage, rowsPerPage);
        setResOpp(newInfo);
    };

    const filterPagesPre = () => {
        setCurrentPage(pre => pre - 1);
    };

    const filterPagesNext = () => {
        setCurrentPage(pre => pre + 1);
    };

    useEffect(() => {
        const ageingData = ageingLeadsData.slice(((currentPage - 1) * rowsPerPage), currentPage * rowsPerPage);
        setResOpp(ageingData);
    }, [currentPage]);
    
    return (
        <React.Fragment>
            <Col>
                <Card>
                    <CardBody>
                        <Col>
                            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                                <DropdownToggle caret>
                                    {selectedAgeingLeadsOption || 'Ageing Leads'}
                                </DropdownToggle>
                                <DropdownMenu>
                                    {ageingLeadsOptions.map((option, index) => (
                                        <DropdownItem key={index} onClick={() => handleOptionSelect(option)}>
                                            {option}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        </Col>
                        <div className="table-responsive mt-4">
                        <Table striped bordered>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Company</th>
                                <th>Created Date</th>
                                <th>Details</th>
                            </tr>
                            </thead>
                            <tbody>
    {resOpp?.map((item, idx) => (
        <tr key={idx}>
            <td>{item.Name}</td>
            <td>{item.Company}</td>
            <td>{item.CreatedDate.slice(0, 10)}</td>
            <td>
                <a href={`https://${base_URL}/lightning/o/Lead/list?filterName=Recent`} target="_blank" rel="noopener noreferrer">
                    Details
                </a>
            </td>
        </tr>
    ))}
</tbody>
                        </Table>
                        </div>
                            <Row className="d-flex justify-content-between">
                                <Col>
                                    <span style={{ color: "red"}}>{error}</span>
                                </Col>
                                <Row sm={1}>
                                    <Col>
                                            <span>Showing {currentPage} of {2}</span>
                                    </Col>
                                    <Col className='d-flex flex-row justify-content-end'>
                                        <button 
                                            className='btn btn-dark' 
                                            onClick={() => filterPagesPre()} 
                                            disabled={currentPage === 1}
                                        >Previous</button>
                                        <div className='p-2'>
                                            <span className='text-center text-black'>{2}</span>
                                        </div>
                                        <button 
                                            className='btn btn-dark' 
                                            onClick={() => filterPagesNext()} 
                                            disabled={currentPage === 2}
                                        >Next page</button>
                                    </Col>
                                </Row>
                            </Row>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default InfoTableLeading;
