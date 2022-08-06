import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useHistory, useParams } from "react-router-dom";
import Header from "../layout/header";
import Rating from "@material-ui/lab/Rating";
import { withStyles } from "@material-ui/core/styles";
import { Footer } from "../layout/footer";
import defaultImage from "../../assets/img/checkout.jpg"
import StarBorderIcon from "@material-ui/icons/StarBorder";
import { setQuestionnaire, getActivityImage } from "../../Store/action/listing"
import toastr from "toastr";

const StyledRating = withStyles({
	iconFilled: {
		color: "#e7ae40",
	},
	iconHover: {
		color: "#e7ae40",
	},
	root: {

	}
})(Rating);

function Questionnaire() {
	const history = useHistory();
	const logo = useSelector((state) => state.logo);
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");
	const { id, userid } = useParams();
	const dispatch = useDispatch();
	const image = useSelector(state => state.list.activity_image);

	useEffect(() => {
		dispatch(getActivityImage(id));
		const script = document.createElement("script");
		script.src = "/assets/js/bundle-0c6e0e19e1.js";
		script.async = true;
		document.body.appendChild(script);
		return () => {
			document.body.removeChild(script);
		};
	}, [dispatch, id]);

	const addReview = (e) => {
		if (comment === "") {
			toastr.info("Please write your comment!");
			return false;
		}
		dispatch(setQuestionnaire(id, userid, rating, comment, history));
	}

	return (
		<>
			<section className="position-relative overflow-hidden">
				<img className="w-100" style={{ objectFit: 'cover' }} src={image && image === "" ? defaultImage : image} alt="" height="480" />
				<div className="homepage-slider-div">
					<div className="mainmenu-wrapper">
						<Header
							logo={logo[0].light}
							class="menu--light"
							history={history}
						/>
					</div>
				</div>
			</section>
			<section className="directory_listiing_detail_area single_area section-bg section-padding-strict short-control">
				<div className="container">
					<div className="atbd_content_module atbd_review_form  cu-radius">
						<div className="atbd_content_module__tittle_area">
							<div className="atbd_area_title">
								<h4>
									<span className="la la-star"></span>Add a Review
              </h4>
							</div>
						</div>
						<div className="atbdb_content_module_contents atbd_give_review_area">
							{/* <!-- ends: .atbd_notice --> */}

							<div className="atbd_review_rating_area d-flex">
								<p style={{ fontSize: "18px" }}>How would you rate the experience of your activity ? </p>
								<div className="atbd_rating_stars">
									<div className="br-wrapper br-theme-fontawesome-stars m-left-15 rating-content">
										<StyledRating
											name="customized-empty"
											value={rating}
											onChange={(event, newValue) => {
												setRating(newValue);
											}}
											className="rating"
											size="large"
											precision={0.5}
											emptyIcon={<StarBorderIcon fontSize="inherit" />}
										/>
									</div>
								</div>
							</div>
							<p style={{ fontSize: "18px" }}>Please write a short review of your experience below:</p>
							<div className="form-group">
								<textarea
									name="content"
									id="review_content"
									className="form-control"
									placeholder="Message"
									rows={7}
									style={{ borderRadius: '20px' }}
									value={comment}
									onChange={(e) => {
										setComment(e.target.value);
									}}
									required
								></textarea>
							</div>
							<p className="text-center" style={{ fontSize: "18px" }}>Thank you <br />The Activities App Team</p>
							<div className="d-flex justify-content-center align-items-center">
								<button
									className="btn btn-gradient btn-gradient-one"
									id="atbdp_review_form_submit" style={{ borderRadius: "5px", padding: "0 45px" }} onClick={() => addReview()}
								>
									Submit
              		</button>
							</div>
						</div>
					</div>
				</div>
			</section>
			<Footer />
		</>
	)
}
export default Questionnaire;